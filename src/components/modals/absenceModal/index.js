//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import _ from 'lodash'

import getCurrentUser from 'selectors/currentUser'
import { saveAbsenceToDB, checkOverlappings, removeAbsenceFromDB } from 'actions/absence'
import { generateGuid, momToSmart, smartToMom } from 'helpers/index'
import { getEffectiveDays, getTotalDays, getButtonsToShow } from './localHelpers'
import type { Store, User, Absence, WorkDays, AbsenceType, AbsenceStatus, AccountPreferences } from 'types/index'

import ErrorMessageDisplay from './errorMessageDisplay'
import AbsenceDetailsDisplay from './absenceDetailsDisplay'
import AbsenceTypeSelect from './absenceTypeSelect'
import AbsenceNotesSection from './absenceNotesSection'
import DisplayVacationRequest from './displayVacationRequest'
import AbsenceConfigs from './absenceConfigs'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

type State = {
  id: string,
  user: string,
  type: AbsenceType | '',
  year: number,
  status: AbsenceStatus,
  startDate: ?number,
  endDate: ?number,
  totalDays: ?number,
  effectiveDays: ?number,
  userNote: ?string,
  adminNote: ?string,
  workDays: ?WorkDays,
  useAvgHours: ?true,
  unpaid: ?true,
  avgDailyMins: number,
  focusedInput: any,
  errorMessage: false | 'loading' | 'overlapping' | 'multiyear'
}

type OwnProps = {
  absence?: Absence,
  userID: string,
  closeModal: ()=>{},
}

type ConProps = {
  user: User,
  currentUser: User,
  preferences: AccountPreferences
}

class AbsenceModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props){
    super(props)
    const { absence, user } = props
    const adminMode = !!this.props.currentUser.isAdmin


    this.state = {
      id:             absence ? absence.id            : generateGuid(),
      user:           absence ? absence.user          : props.userID,
      type:           absence ? absence.type          : adminMode ? '' : 'vac',
      year:           absence ? absence.year          : moment().year(),
      status:         absence ? absence.status        : this.getDefault_status(),
      startDate:      absence ? absence.startDate              : null,
      endDate:        absence ? absence.endDate                : null,
      totalDays:      absence ? absence.totalDays              : null,
      effectiveDays:  absence ? absence.effectiveDays          : null,
      userNote:       absence ? (absence.userNote    || null)  : null,
      adminNote:      absence ? (absence.adminNote   || null)  : null,
      workDays:       absence ? (absence.workDays    || null)  : props.user.workDays,
      useAvgHours:    absence ? (absence.useAvgHours || null)  : this.getDefaul_useAvgHours('ill'), // TODO: come back here ...
      unpaid:         absence ? (absence.unpaid      || null)  : null,
      avgDailyMins:   user.avgDailyMins,
      focusedInput:   null, // we omit this before saving to db!
      errorMessage:   false, // we omit this before saving to db!
    }
  }

  // returns the useAvgHours-Setting for a specific AbsenceType
  getDefaul_useAvgHours = (type: AbsenceType): true | null => {
    if(type === 'ill') return this.props.preferences.useAvgHoursForIll ? true : null
    if(type === 'vac') return this.props.preferences.useAvgHoursForVac ? true :null
    return null
  }

  getDefault_status = (): AbsenceStatus => {
    const { isAdmin } = this.props.currentUser
    return isAdmin ? 'accepted' : 'requested'
  }

  changeType = (type: AbsenceType) => {
    const useAvgHours = this.getDefaul_useAvgHours(type)
    this.setState({ type , useAvgHours })
  }

  datesChanged = (d: {startDate: ?moment, endDate: ?moment}) => {
    const {startDate, endDate} = d
    this.setState({
      startDate:      startDate ? momToSmart(startDate) : null,
      endDate:        endDate   ? momToSmart(endDate): null,
      year:           moment(startDate).year(),
      totalDays:      getTotalDays(startDate, endDate),
      effectiveDays:  getEffectiveDays(startDate, endDate, this.state.workDays, 'HH'),
      errorMessage:  !!(startDate && endDate) ? 'loading' : false
    })

    // checking if selected Range is Valid here
    if(startDate && endDate){
      if( endDate.year() !== startDate.year() ){
        this.setState({errorMessage: 'multiyear'})
      }else{
        checkOverlappings(startDate, endDate, this.props.userID)
          .then((res: boolean)=> this.setState({errorMessage: res && 'overlapping'}))
      }
    }
  }

  workDaysChanged = (workDays: WorkDays) => {
    const startDate = this.state.startDate ? smartToMom(this.state.startDate) : null
    const endDate =   this.state.endDate   ? smartToMom(this.state.endDate) : null
    this.setState({ workDays, effectiveDays:  getEffectiveDays(startDate, endDate, workDays, 'HH') })
  }

  changeAdminNote = (note) => this.setState({adminNote: note})
  changeUserNote = (note) => this.setState({userNote: note})

  acceptRequest = () => this.saveAbsence({ ...this.state, status: 'accepted'})

  removeAbsence = () => {
    removeAbsenceFromDB(this.state.id)
    this.props.closeModal()
  }

  saveAbsence   = (absenceDirty) => {
    const cleanAbsence = _.omit(absenceDirty, ['focusedInput', 'errorMessage'])
    saveAbsenceToDB(cleanAbsence)
    this.props.closeModal()
  }

  render(){
    const { closeModal, user, currentUser } = this.props
    const { type, startDate, endDate, focusedInput, userNote, adminNote, totalDays, status, errorMessage, unpaid, effectiveDays } = this.state
    const adminMode = !!currentUser.isAdmin
    const isComplete = startDate && endDate && type && !errorMessage
    const accepted = status === 'accepted'
    const requested = status === 'requested'
    const showBtn = getButtonsToShow(this.props, this.state)

    return(
      <SModal.Main onClose={closeModal} title={user.name} >
  			<SModal.Body>
  				<fb className="absenceModalMain">
            <fb className='firstRow'>
              { adminMode && requested && <DisplayVacationRequest startDate={startDate} endDate={endDate} /> }
              { accepted && adminMode && <AbsenceTypeSelect selectedType={type} selectType={this.changeType} /> }
              { ((adminMode && accepted) || (!adminMode && requested)) &&
                <DateRangePicker
                  startDate={startDate ? moment(startDate, 'YYYYMMDD') : null}
                  endDate={endDate ? moment(endDate, 'YYYYMMDD') : null}
                  onDatesChange={this.datesChanged}
                  minimumNights={0}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}/>
              }
            </fb>
            { startDate && endDate && !errorMessage && <AbsenceDetailsDisplay totalDays={totalDays} effectiveDays={effectiveDays} /> }
            { startDate && endDate &&  errorMessage && <ErrorMessageDisplay msg={errorMessage} /> }
            <AbsenceNotesSection
              userNote={userNote}
              adminNote={adminNote}
              changeAdminNote={this.changeAdminNote}
              changeUserNote={this.changeUserNote}
              adminMode={adminMode}
              expanded={!!(userNote || adminNote)}
            />
            { adminMode && <AbsenceConfigs
              unpaid={unpaid}
              toggleUnpaid={()=>this.setState({unpaid: unpaid ? null : true})}
            />}
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

}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  currentUser: getCurrentUser(state),
  user: (state.core.users.find(u => u.id === ownProps.userID): any), // -> telling Flow to shut up. Result must be a User
  preferences:   state.core.accountDetails.preferences,
  bundeslandCode: 'HH' // TODO: get bundeslandCode from the DB somewhere
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps, actionCreators)
export default connector(AbsenceModal)
