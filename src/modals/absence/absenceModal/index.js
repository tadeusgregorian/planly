//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import omit from 'lodash/omit'
import keys from 'lodash/keys'

import getCurrentUser from 'selectors/currentUser'
import { openModal } from 'actions/ui/modals'
import { saveAbsenceToDB, removeAbsenceFromDB } from 'actions/absence'
import { generateGuid, momToSmart, smartToMom, smartDatesDiff } from 'helpers/index'
import { momentToWeekID } from 'helpers/roster';
import { getEffectiveDays, getButtonsToShow, checkOverlapping, getAvgMinsOfUser } from './localHelpers'
import type { Store, User, Absence, AbsenceType, AbsenceTypeFilter, AbsenceStatus, AccountPreferences, WorkDays } from 'types/index'

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
  avgMins: number,
  workDays: WorkDays,
  effectiveDays: ?number,
  unpaid: true | null,
  note: ?string,
  focusedInput: any,
  errorMessage: ErrorMesage,
  loading: boolean,
  advancedOpen: boolean,
  modified: { avgMins?: true, effectiveDays?: true } // indicates if a prop is manually modified
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
    const { absence, currentYear, currentMonth, currentType, user } = props
    const adminMode = !!this.props.currentUser.isAdmin
    const initialType = adminMode ? ( currentType === 'all' ? '' : currentType ) : 'vac' // nonAdmin can only have VAC; ALL is treated as no type selected

    this.state = {
      id:             absence ? absence.id            : generateGuid(),
      user:           absence ? absence.user          : props.userID,
      workDays:       absence ? absence.workDays      : user.workDays,
      type:           absence ? absence.type          : initialType,
      status:         absence ? absence.status        : adminMode ? 'accepted' : 'requested',
      year:           absence ? absence.year          : currentYear,
      startDate:      absence ? absence.startDate              : null,
      endDate:        absence ? absence.endDate                : null,
      effectiveDays:  absence ? absence.effectiveDays          : null,
      unpaid:         absence ? (absence.unpaid    || null)    : null,
      note:           absence ? (absence.note      || '')      : '',
      avgMins:        absence ? absence.avgMins                : 0,
      modified:       absence ? (absence.modified  || {})      : {}, // indicates if a prop is manually modified
      focusedInput:   null, // we omit this before saving to db!
      errorMessage:   false, // we omit this before saving to db!
      loading:        false, // we omit this before saving to db!
      advancedOpen:   !!(absence && (absence.unpaid || (absence.modified && absence.modified.workDays))),
    }

    this.currentMom = moment().year(currentYear).month(currentMonth)
  }

  changeType  = (type: AbsenceType)         => { this.setState({ type }) }
  setErrorMsg = (errorMessage: ErrorMesage) => { this.setState({ errorMessage }) }

  datesChanged = (d: {startDate: ?moment, endDate: ?moment}) => {
    const { id, modified } = this.state
    const { userID, user, preferences } = this.props
    const { startDate, endDate } = d
    const { bundesland } = preferences

    this.setState({
      startDate:      startDate ? momToSmart(startDate) : null,
      endDate:        endDate   ? momToSmart(endDate)   : null,
    })

    if(startDate && endDate){
      if(endDate.year() !== startDate.year()) return this.setErrorMsg('multiyear')

      this.setState({
        loading:       true,
        errorMessage:  false,
        year:          startDate.year(),
      })

      !modified.avgMins && this.setState({ avgMins: getAvgMinsOfUser(user, momentToWeekID(startDate)) })
      !modified.effectiveDays && this.setState({ effectiveDays: getEffectiveDays(startDate, endDate, bundesland, user.workDays) })

      checkOverlapping(startDate, endDate, userID, id).then((isOverlapping) => {
        this.setState({
          loading: false,
          errorMessage: isOverlapping ? 'overlapping' : false
        })
      })
    }
  }

  changeNote     = (note) => this.setState({ note })
  acceptRequest  = ()     => this.saveAbsence({ ...this.state, status: 'accepted'})
  declineRequest = ()     => this.removeAbsence({ isDecline: true })

  removeAbsence = ({ isDecline }) => {
    const modalProps = {
      title: isDecline ? 'Urlaubsantrag' : 'Uralaub Löschen',
      text:  isDecline ? 'Urlaubsantrag wirklich ablehnen?' : 'Urlaub wirklich löschen?',
      acceptBtnRed: true,
      acceptBtnLabel: 'Löschen',
      onAccept: () => {
        removeAbsenceFromDB(this.state.id)
        this.props.closeModal()
      }
    }

    this.props.openModal('CONFIRMATION', modalProps)
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
    const { effectiveDays, modified } = this.state
    this.props.openModal('EDIT_ABSENCE_DAYS', {
      effectiveDays: this.state.effectiveDays,
      changeEffectiveDays: (_effectiveDays: number)=> {
        this.setState({
          effectiveDays: _effectiveDays,
          modified: effectiveDays !== _effectiveDays ? { ...modified, effectiveDays: true } : modified
        })
      }
    })
  }

  openTimeInputModal = () => {
    const { avgMins, modified } = this.state
    const modalProps = {
      title: 'Stunden pro Urlaubstag bearbeiten',
      text: 'Zeit die pro effektivem Urlaubstag auf das Stundenkonto gutgeschrieben wird',
      onInputConfirmed: ({mins}) => this.setState({ avgMins: mins, modified: { ...modified, avgMins: true} }),
      initialMins: avgMins,
      noNegatives: true,
    }
    this.props.openModal('DURATION_INPUT', modalProps)
  }

  changeWorkDays = (_workDays) => {
    const { modified, startDate, endDate } = this.state
    const { user, preferences } = this.props
    const { bundesland } = preferences
    const same = keys(_workDays).sort().join('') === keys(user.workDays).sort().join('')
    this.setState({
      workDays: _workDays,
      modified: same ? { ...modified, workDays: null } : { ...modified, workDays: true }
    })
    if(!modified.avgMins && startDate){
      const avgMins = getAvgMinsOfUser(user, momentToWeekID(smartToMom(startDate)), _workDays)
      this.setState({ avgMins })
    }
    if(!modified.effectiveDays && startDate && endDate){
      const effectiveDays = getEffectiveDays(smartToMom(startDate), smartToMom(endDate), bundesland, _workDays)
      this.setState({ effectiveDays })
    }
  }

  render(){
    const { closeModal, user, currentUser, currentType } = this.props
    const { type, startDate, endDate, focusedInput, note, status, errorMessage, effectiveDays, loading, advancedOpen, unpaid, avgMins, workDays } = this.state
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
                  openTimeInputModal={this.openTimeInputModal}
                  avgMins={avgMins}
                  unpaid={unpaid}
                  showAvgMins={type === 'vac'}
                />
            }
            { startDate && endDate &&  errorMessage && <ErrorMessageDisplay msg={errorMessage} /> }
            <AbsenceNotesSection note={note} changeNote={this.changeNote} />
            <AdvancedSettings
              advancedOpen={advancedOpen}
              unpaid={unpaid}
              setAdvancedOpen={(open) => this.setState({ advancedOpen: open })}
              setUnpaid={(unpaid) => this.setState({ unpaid: unpaid || null })}
              workDays={workDays}
              changeWorkDays={this.changeWorkDays}
              type={type}
            />
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
           {  showBtn.Delete  && <SButton label='Löschen'   onClick={this.removeAbsence} grey left />}
           {  showBtn.Reject  && <SButton label='Ablehnen'  onClick={this.declineRequest} color='#ff3f3f'/>}
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
