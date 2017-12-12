//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import omit from 'lodash/omit'

import getCurrentUser from 'selectors/currentUser'
import { openModal } from 'actions/ui/modals'
import { saveAbsenceToDB, removeAbsenceFromDB } from 'actions/absence'
import { generateGuid, momToSmart, smartDatesDiff } from 'helpers/index'
import { getEffectiveDays, getButtonsToShow, checkOverlapping } from './localHelpers'
import type { Store, User, Absence, AbsenceType, AbsenceTypeFilter, AbsenceStatus, AccountPreferences } from 'types/index'

import AdvancedSettings from './advancedSettings'
import ErrorMessageDisplay from './errorMessageDisplay'
import AbsenceDetailsDisplay from './absenceDetailsDisplay'
import AbsenceTypeSelect from './absenceTypeSelect'
import AbsenceNotesSection from './absenceNotesSection'
import DisplayVacationRequest from './displayVacationRequest'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

type ErrorMesage = false | 'overlapping' | 'multiyear'

type State = {
  id: string,
  user: string,
  type: AbsenceType | '',
  status: AbsenceStatus,
  year: number,
  startDate: ?number,
  endDate: ?number,
  effectiveDays: ?number,
  unpaid: true | null,
  note: ?string,
  focusedInput: any,
  errorMessage: ErrorMesage,
  loading: boolean,
  advancedOpen: boolean,
}

type OwnProps = {
  absence?: Absence,
  userID: string,
  closeModal: ()=>{},
}

type ConProps = {
  user: User,
  currentUser: User,
  preferences: AccountPreferences,
  currentYear: number,
  currentMonth: number,
  currentType: AbsenceTypeFilter,
  openModal: Function
}

class AbsenceModal extends PureComponent{
  state: State
  props: OwnProps & ConProps
  currentMom: moment // current Year and Month ob Absence UI

  constructor(props){
    super(props)
    const { absence, currentYear, currentMonth, currentType } = props
    const adminMode = !!this.props.currentUser.isAdmin
    const initialType = adminMode ? ( currentType === 'all' ? '' : currentType ) : 'vac' // nonAdmin can only have VAC; ALL is treated as no type selected

    this.state = {
      id:             absence ? absence.id            : generateGuid(),
      user:           absence ? absence.user          : props.userID,
      type:           absence ? absence.type          : initialType,
      status:         absence ? absence.status        : adminMode ? 'accepted' : 'requested',
      year:           absence ? absence.year          : currentYear,
      startDate:      absence ? absence.startDate              : null,
      endDate:        absence ? absence.endDate                : null,
      effectiveDays:  absence ? absence.effectiveDays          : null,
      unpaid:         absence ? (absence.unpaid    || null)    : null,
      note:           absence ? (absence.note      || '')      : '',
      focusedInput:   null, // we omit this before saving to db!
      errorMessage:   false, // we omit this before saving to db!
      loading:        false, // we omit this before saving to db!
      advancedOpen:   absence ? (absence.unpaid || false)       : false,
    }

    this.currentMom = moment().year(currentYear).month(currentMonth)
  }

  changeType  = (type: AbsenceType)         => { this.setState({ type }) }
  setErrorMsg = (errorMessage: ErrorMesage) => { this.setState({ errorMessage }) }

  datesChanged = (d: {startDate: ?moment, endDate: ?moment}) => {
    const { id } = this.state
    const { userID, user, currentYear, preferences } = this.props
    const { startDate, endDate } = d
    const { bundesland } = preferences

    this.setState({
      year:           startDate ? startDate.year()      : currentYear,
      startDate:      startDate ? momToSmart(startDate) : null,
      endDate:        endDate   ? momToSmart(endDate)   : null,
      effectiveDays:  getEffectiveDays(startDate, endDate, bundesland, user.workDays),
      loading:        true,
    })

    if(!startDate || !endDate) return // if both dates are set -> check for validity of selected range
    if(endDate.year() !== startDate.year())              return this.setErrorMsg('multiyear')
    checkOverlapping(startDate, endDate, userID, id).then((isOverlapping) => {
      this.setState({ loading: false, errorMessage: isOverlapping ? 'overlapping' : false })
    })
    this.setErrorMsg(false)
  }

  changeNote    = (note) => this.setState({ note })
  acceptRequest = ()     => this.saveAbsence({ ...this.state, status: 'accepted'})

  removeAbsence = () => {
    removeAbsenceFromDB(this.state.id)
    this.props.closeModal()
  }

  saveAbsence   = (absenceDirty) => {
    const cleanAbsence = omit(absenceDirty, ['focusedInput', 'errorMessage', 'loading', 'advancedOpen'])
    saveAbsenceToDB(this.props.user, {
      ...cleanAbsence,
      note: this.state.note || null, // turning '' to null
    })
    this.props.closeModal()
  }

  openEffectiveDaysModal = () => {
    this.props.openModal('EDIT_ABSENCE_DAYS', {
      effectiveDays: this.state.effectiveDays,
      changeEffectiveDays: (effectiveDays: number)=>this.setState({ effectiveDays })
    })
  }

  render(){
    const { closeModal, user, currentUser, currentType } = this.props
    const { type, startDate, endDate, focusedInput, note, status, errorMessage, effectiveDays, loading, advancedOpen, unpaid } = this.state
    const adminMode = !!currentUser.isAdmin
    const isComplete = startDate && endDate && type && !errorMessage
    const accepted = status === 'accepted'
    const requested = status === 'requested'
    const typeSelectable = adminMode && accepted && currentType === 'all'
    const showBtn = getButtonsToShow(this.props, this.state)

    return(
      <SModal.Main onClose={closeModal} title={user.name} >
  			<SModal.Body>
  				<fb className="absenceModalMain">
            { adminMode && requested && <DisplayVacationRequest startDate={startDate} endDate={endDate} /> }
            { typeSelectable && <AbsenceTypeSelect selectedType={type} selectType={this.changeType} /> }
            { ((adminMode && accepted) || (!adminMode && requested)) &&
              <fb className='selectRangeWrapper'>
                <fb className='label'>Zeitraum</fb>
                <DateRangePicker
                  startDate={startDate ? moment(startDate, 'YYYYMMDD') : null}
                  endDate={endDate ? moment(endDate, 'YYYYMMDD') : null}
                  onDatesChange={this.datesChanged}
                  initialVisibleMonth={() => this.currentMom}
                  minimumNights={0}
                  isOutsideRange={adminMode ? () => false : undefined}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}/>
              </fb>
            }
            { startDate && endDate && !errorMessage &&
              <AbsenceDetailsDisplay
                adminMode={adminMode}
                loading={loading}
                totalDays={smartDatesDiff(startDate, endDate)}
                effectiveDays={effectiveDays}
                openEffectiveDaysModal={this.openEffectiveDaysModal}
              />
            }
            { startDate && endDate &&  errorMessage && <ErrorMessageDisplay msg={errorMessage} /> }
            <AbsenceNotesSection note={note} changeNote={this.changeNote} />
            <AdvancedSettings
              advancedOpen={advancedOpen}
              unpaid={unpaid}
              setAdvancedOpen={(open) => this.setState({ advancedOpen: open })}
              setUnpaid={(unpaid) => this.setState({ unpaid: unpaid || null })}
            />
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
           {  showBtn.Delete  && <SButton label='Löschen'   onClick={this.removeAbsence} color='#ff3f3f' grey left />}
           {  showBtn.Reject  && <SButton label='Ablehnen'  onClick={this.removeAbsence} color='#ff3f3f'/>}
           {  showBtn.Accept  && <SButton label='Annehmen'  onClick={this.acceptRequest} color='#00a2ef'         disabled={!isComplete} />}
           {  showBtn.Save    && <SButton label='Speichern' onClick={()=>this.saveAbsence(this.state)}           disabled={!isComplete} color='#00a2ef' />}
           {  showBtn.Request && <SButton label='Urlaub Beantragen' onClick={()=>this.saveAbsence(this.state)}   disabled={!isComplete} color='#00a2ef' /> }
        </SModal.Footer>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  openModal
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  currentUser: getCurrentUser(state),
  user: (state.core.users.find(u => u.id === ownProps.userID): any), // -> telling Flow to shut up. Result must be a User
  preferences: state.core.accountDetails.preferences,
  currentYear: state.ui.absence.currentYear,
  currentMonth: state.ui.absence.currentMonth,
  currentType: state.ui.absence.currentType
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps, actionCreators)
export default connector(AbsenceModal)
