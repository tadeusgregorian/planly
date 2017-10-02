//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'

import getCurrentUser from 'selectors/currentUser'
import { generateGuid, getTodaySmart, momToSmart } from 'helpers/index'
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
  total: ?number,
  effective: ?number,
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
}

class AbsenceModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props){
    super(props)
    const { absence } = props

    this.state = {
      id:           absence ? absence.id        : generateGuid(),
      user:         absence ? absence.userID    : props.userID,
      type:         absence ? absence.type      : 'ill', // just ill per default
      year:         absence ? absence.year      : moment().year(),
      status:       absence ? absence.status    : this.getDefaultStatus(),
      startDate:    absence ? absence.start     : null,
      endDate:      absence ? absence.end       : null,
      total:        absence ? absence.total     : null,
      effective:    absence ? absence.effective : null,

      userNote:     absence ? absence.type          : null,
      adminNote:    absence ? absence.type          : null,
      excludedDays: absence ? absence.excludedDays  : props.excludedDaysOfUser,
      dayRate:      absence ? absence.dayRate       : props.dayRateOfUser, // number of minutes that get added to the week-sum for an absent-day
      hollow:       absence ? absence.isHollow      : props.absenceTypeIsHollow,

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
      total:      getTotalDays(d.startDate, d.endDate),
      effective:  getEffectiveDays(d.startDate, d.endDate, this.props.excludedDaysOfUser, 'HH')
    })
  }

  changeAdminNote = (note) => this.setState({adminNote: note})
  changeUserNote = (note) => this.setState({userNote: note})

  rejectRequest = () => console.log('Reject Req')
  acceptRequest = () => console.log('Accept Req')
  saveAbsence = () => console.log('Save Absence')

  render(){
    const { closeModal, user, currentUser } = this.props
    const { type, startDate, endDate, focusedInput, userNote, adminNote, total, effective, status } = this.state
    const adminMode = !!currentUser.isAdmin

    return(
      <SModal.Main onClose={closeModal} title={'Abwesenheit - ' + user.name} >
  			<SModal.Body>
  				<fb className="absenceModalMain">
            <AbsenceTypeSelect selectedType={type} selectType={this.changeType} />
            <DateRangePicker
              startDate={startDate ? moment(startDate, 'YYYYMMDD') : null}
              endDate={endDate ? moment(endDate, 'YYYYMMDD') : null}
              onDatesChange={this.datesChanged} // PropTypes.func.isRequired,
              focusedInput={focusedInput}
              onFocusChange={focusedInput => this.setState({ focusedInput })}
            />
            { startDate && endDate && <AbsenceDetailsDisplay
              total={total}
              effective={effective}
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
           {  adminMode && status === 'requested' && <SButton label='Annehmen'  onClick={this.acceptRequest} right color='#00a2ef'/>}
           {  adminMode && status === 'accepted'  && <SButton label='Speichern' onClick={this.saveAbsence} right color='#00a2ef'/>}
           { !adminMode && <SButton right label='Urlaub Beantragen'  onClick={this.saveAbsence} right color='#00a2ef'/> }
        </SModal.Footer>
  		</SModal.Main>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  currentUser: getCurrentUser(state),
  user: (state.core.users.find(u => u.id === ownProps.userID): any), // -> telling Flow to be silent
  excludedDaysOfUser: {sa: true},           // TODO: write function: getExcludedDaysOfUser !!!
  dayRateOfUser: 480,                       // TODO: wire Function: getDayRateOfuser !!!
  absenceTypeIsHollow: false,               // TODO: write getAccountSettings([hollowAbsenceTypes...
  bundeslandCode: 'HH'                      // TODO: get bundeslandCode from the DB somewhere
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps)
export default connector(AbsenceModal)
