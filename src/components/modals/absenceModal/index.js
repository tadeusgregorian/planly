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
import { getEffectiveDays, getTotalDays } from './localHelpers'
import type { Store, User, Absence, WorkDays, AbsenceType, AbsenceStatus, AccountPreferences } from 'types/index'

import AbsenceDetailsDisplay from './absenceDetailsDisplay'
import AbsenceTypeSelect from './absenceTypeSelect'
import AbsenceNotesSection from './absenceNotesSection'
import DisplayVacationRange from './displayVacationRange'
import AbsenceConfigs from './absenceConfigs'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css'

type State = {
  id: string,
  user: string,
  type: ?AbsenceType,
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
  focusedInput: any,
  isOverlapping: boolean | 'loading', // i know dirty...
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
    const { absence } = props

    this.state = {
      id:             absence ? absence.id            : generateGuid(),
      user:           absence ? absence.user          : props.userID,
      type:           absence ? absence.type          : 'ill', // just ill per default // TODO: come back here ...
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
      focusedInput:   null, // we omit this before saving to db!
      isOverlapping:  false, // we omit this before saving to db!
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
    this.setState({
      startDate:      d.startDate ? momToSmart(d.startDate) : null,
      endDate:        d.endDate   ? momToSmart(d.endDate): null,
      year:           moment(d.startDate).year(),
      totalDays:      getTotalDays(d.startDate, d.endDate),
      effectiveDays:  getEffectiveDays(d.startDate, d.endDate, this.state.workDays, 'HH'),
      isOverlapping:  !!(d.startDate && d.endDate) ? 'loading' : false
    })

    if(d.startDate && d.endDate){
      checkOverlappings(d.startDate, d.endDate, this.props.userID)
        .then((res: boolean)=> this.setState({isOverlapping: res}))
    }
  }

  workDaysChanged = (workDays: WorkDays) => {
    const startDate = this.state.startDate ? smartToMom(this.state.startDate) : null
    const endDate =   this.state.endDate   ? smartToMom(this.state.endDate) : null
    this.setState({
      workDays,
      effectiveDays:  getEffectiveDays(startDate, endDate, workDays, 'HH'),
    })
  }

  changeAdminNote = (note) => this.setState({adminNote: note})
  changeUserNote = (note) => this.setState({userNote: note})

  acceptRequest = () => this.saveAbsence({ ...this.state, status: 'accepted'})

  removeAbsence = () => {
    removeAbsenceFromDB(this.state.id)
    this.props.closeModal()
  }

  saveAbsence   = (absenceDirty) => {
    const cleanAbsence = _.omit(absenceDirty, ['focusedInput', 'isOverlapping'])
    saveAbsenceToDB(cleanAbsence)
    this.props.closeModal()
  }

  render(){
    const { closeModal, user, currentUser } = this.props
    const { type, startDate, endDate, focusedInput, userNote, adminNote, totalDays, workDays, status, isOverlapping, unpaid, useAvgHours, effectiveDays } = this.state
    const adminMode = !!currentUser.isAdmin
    const isComplete = startDate && endDate && !isOverlapping

    return(
      <SModal.Main onClose={closeModal} title={user.name} >
  			<SModal.Body>
  				<fb className="absenceModalMain">
            <fb className='firstRow'>
              { status === 'accepted' && <AbsenceTypeSelect selectedType={type} selectType={this.changeType} /> }
              { status === 'accepted' &&
                <DateRangePicker
                  startDate={startDate ? moment(startDate, 'YYYYMMDD') : null}
                  endDate={endDate ? moment(endDate, 'YYYYMMDD') : null}
                  onDatesChange={this.datesChanged}
                  focusedInput={focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
              />}
              { status === 'requested' && <DisplayVacationRange startDate={startDate} endDate={endDate} /> }
            </fb>
            { startDate && endDate && !isOverlapping && <AbsenceDetailsDisplay totalDays={totalDays} effectiveDays={effectiveDays} /> }
            { isOverlapping === 'loading' && <fb>loading</fb> }
            { isOverlapping === true && <fb>Zeitraum überschneidet sich mit einem anderen Abwesenheits-Eintrag.</fb> }
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
              workDays={workDays}
              useAvgHours={useAvgHours}
              toggleUnpaid={()=>this.setState({unpaid: unpaid ? null : true})}
              toggleUseAvgHours={()=>this.setState({useAvgHours: useAvgHours ? null : true})}
              updateWorkDays={this.workDaysChanged}
            />}
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
           {  adminMode && status === 'accepted'  && <SButton label='Löschen'   onClick={this.removeAbsence} color='#ff3f3f' grey left />}
           {  adminMode && status === 'requested' && <SButton label='Ablehnen'  onClick={this.removeAbsence} color='#ff3f3f'/>}
           {  adminMode && status === 'requested' && <SButton label='Annehmen'  onClick={this.acceptRequest} color='#00a2ef' disabled={!isComplete} />}
           {  adminMode && status === 'accepted'  && <SButton label='Speichern' onClick={()=>this.saveAbsence(this.state)}   disabled={!isComplete} color='#00a2ef' />}
           { !adminMode &&                   <SButton label='Urlaub Beantragen' onClick={()=>this.saveAbsence(this.state)}   disabled={!isComplete} color='#00a2ef' /> }
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
