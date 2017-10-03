//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'
import _ from 'lodash'

import getCurrentUser from 'selectors/currentUser'
import { saveAbsenceToDB } from 'actions/absence'
import { generateGuid, momToSmart } from 'helpers/index'
import { getEffectiveDays, getTotalDays } from './localHelpers'
import type { Store, User, Absence, ExcludedDays, AbsenceType, AbsenceStatus } from 'types/index'

import AbsenceDetailsDisplay from './absenceDetailsDisplay'
import AbsenceTypeSelect from './absenceTypeSelect'
import AbsenceNotesSection from './absenceNotesSection'
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
  excludedDays: ?ExcludedDays,
  dayRate: number | null,
  hollow: true | null,
  focusedInput: any
}

type OwnProps = {
  absence?: Absence,
  userID: string,
  closeModal: ()=>{},
}

type ConProps = {
  user: User,
  currentUser: User,
  excludedDaysOfUser: ExcludedDays,
  dayRateOfUser: number,
  saveAbsenceToDB: (Absence)=>any,
}

class AbsenceModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props){
    super(props)
    const { absence } = props

    this.state = {
      id:             absence ? absence.id            : generateGuid(),
      user:           absence ? absence.userID        : props.userID,
      type:           absence ? absence.type          : 'ill', // just ill per default
      year:           absence ? absence.year          : moment().year(),
      status:         absence ? absence.status        : this.getDefaultStatus(),
      startDate:      absence ? absence.start         : null,
      endDate:        absence ? absence.end           : null,
      totalDays:      absence ? absence.totalDays     : null,
      effectiveDays:  absence ? absence.effectiveDays : null,
      userNote:       absence ? absence.type          : null,
      adminNote:      absence ? absence.type          : null,
      excludedDays:   absence ? absence.excludedDays  : props.excludedDaysOfUser,
      dayRate:        absence ? absence.dayRate       : props.dayRateOfUser, // number of minutes that get added to the week-sum for an absent-day
      hollow:         absence ? absence.isHollow      : props.absenceTypeIsHollow,
      focusedInput: null
    }
  }

  getDefaultStatus = (): AbsenceStatus => {
    const { isAdmin } = this.props.currentUser
    return isAdmin ? 'accepted' : 'requested'
  }

  saveClicked = () => { this.props.closeModal() }
  changeType = (type: AbsenceType) => { this.setState({type}) }

  datesChanged = (d: {startDate: ?moment, endDate: ?moment}) => {
    this.setState({
      startDate:  d.startDate ? momToSmart(d.startDate) : null,
      endDate:    d.endDate   ? momToSmart(d.endDate): null,
      year:       moment(d.startDate).year(),
      totalDays:      getTotalDays(d.startDate, d.endDate),
      effectiveDays:  getEffectiveDays(d.startDate, d.endDate, this.props.excludedDaysOfUser, 'HH')
    })
  }

  changeAdminNote = (note) => this.setState({adminNote: note})
  changeUserNote = (note) => this.setState({userNote: note})

  rejectRequest = () => console.log('Reject Req')
  acceptRequest = () => console.log('Accept Req')
  saveAbsence   = () => this.props.saveAbsenceToDB(_.omit(this.state, 'focusedInput'))

  render(){
    const { closeModal, user, currentUser } = this.props
    const { type, startDate, endDate, focusedInput, userNote, adminNote, totalDays, effectiveDays, status } = this.state
    const adminMode = !!currentUser.isAdmin
    const isComplete = startDate && endDate

    return(
      <SModal.Main onClose={closeModal} title={user.name} >
  			<SModal.Body>
  				<fb className="absenceModalMain">
            <fb className='firstRow'>
              <AbsenceTypeSelect selectedType={type} selectType={this.changeType} />
              <DateRangePicker
                startDate={startDate ? moment(startDate, 'YYYYMMDD') : null}
                endDate={endDate ? moment(endDate, 'YYYYMMDD') : null}
                onDatesChange={this.datesChanged} // PropTypes.func.isRequired,
                focusedInput={focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
              />
            </fb>
            { startDate && endDate && <AbsenceDetailsDisplay
              totalDays={totalDays}
              effectiveDays={effectiveDays}
            /> }
            <AbsenceNotesSection
              userNote={userNote}
              adminNote={adminNote}
              changeAdminNote={this.changeAdminNote}
              changeUserNote={this.changeUserNote}
              adminMode={adminMode}
            />
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
           {  adminMode && status === 'requested' && <SButton label='Ablehnen'  onClick={this.rejectRequest} right color='red'/>}
           {  adminMode && status === 'requested' && <SButton label='Annehmen'  onClick={this.acceptRequest} right color='#00a2ef' disabled={!isComplete} />}
           {  adminMode && status === 'accepted'  && <SButton label='Speichern' onClick={this.saveAbsence} right color='#00a2ef' disabled={!isComplete}/>}
           { !adminMode && <SButton label='Urlaub Beantragen'  onClick={this.saveAbsence} right color='#00a2ef' disabled={!isComplete}/> }
        </SModal.Footer>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  saveAbsenceToDB
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  currentUser: getCurrentUser(state),
  user: (state.core.users.find(u => u.id === ownProps.userID): any), // -> telling Flow to be silent
  excludedDaysOfUser: {sa: true},           // TODO: write function: getExcludedDaysOfUser !!!
  dayRateOfUser: 480,                       // TODO: wire Function: getDayRateOfuser !!!
  absenceTypeIsHollow: false,               // TODO: write getAccountSettings([hollowAbsenceTypes...
  bundeslandCode: 'HH'                      // TODO: get bundeslandCode from the DB somewhere
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps, actionCreators)
export default connector(AbsenceModal)
