//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { DateRangePicker } from 'react-dates'
import moment from 'moment'

import { generateGuid, getTodaySmart, momToSmart } from 'helpers/index'
import { getEffectiveDays, getTotalDays, isHolidayCheck, getEffectiveDays2 } from './localHelpers'
import type { Store, User, Absence, ExcludedDays, AbsenceType } from 'types/index'

import AbsenceTypeSelect from './absenceTypeSelect'
import SModal from 'components/sModal'
import './styles.css'

type State = {
  id: string,
  user: string,
  type: ?AbsenceType,
  year: number,
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
      id:           absence ? absence.id      : generateGuid(),
      user:         absence ? absence.userID  : props.userID,
      type:         absence ? absence.type    : 'ill', // just ill per default
      year:         absence ? absence.year    : moment().year(),
      startDate:    absence ? absence.start   : getTodaySmart(),
      endDate:      absence ? absence.end     : getTodaySmart(),
      total:        absence ? absence.total   : 1,
      effective:    absence ? absence.total   : getEffectiveDays(getTodaySmart(), getTodaySmart()),

      userNote:     absence ? absence.type          : null,
      adminNote:    absence ? absence.type          : null,
      excludedDays: absence ? absence.excludedDays  : props.excludedDaysOfUser,
      dayRate:      absence ? absence.dayRate       : props.dayRateOfUser, // number of minutes that get added to the week-sum for an absent-day
      hollow:       absence ? absence.isHollow      : props.absenceTypeIsHollow,

      focusedInput: null
    }
  }

  saveClicked = () => { this.props.closeModal() }
  changeType = (type: AbsenceType) => { this.setState({type}) }
  datesChanged = (d: {startDate: ?moment, endDate: ?moment}) => {
    this.setState({
      startDate: d.startDate ? momToSmart(d.startDate) : null,
      endDate: d.endDate ? momToSmart(d.endDate): null,
      year: moment(d.startDate).year()
    })
  }

  render(){
    const { closeModal, user, excludedDaysOfUser } = this.props
    const { type, startDate, endDate, focusedInput } = this.state
    console.log(getEffectiveDays2(startDate, endDate, excludedDaysOfUser, 'HH'))

    return(
      <SModal.Main onClose={closeModal} title={'Abwesenheit - ' + user.name} >
  			<SModal.Body>
  				<fb className="absenceModalMain">
            <AbsenceTypeSelect selectedType={type} selectType={this.changeType} />
            <fb className='dateRangeSection'>
              <fb className='dateRangeLabel'>Zeitraum</fb>
              <DateRangePicker
                startDate={startDate ? moment(startDate, 'YYYYMMDD') : null}
                endDate={endDate ? moment(endDate, 'YYYYMMDD') : null}
                onDatesChange={this.datesChanged} // PropTypes.func.isRequired,
                focusedInput={focusedInput}
                onFocusChange={focusedInput => this.setState({ focusedInput })}
              />
            </fb>
  				</fb>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  user: (state.core.users.find(u => u.id === ownProps.userID): any), // -> telling Flow to be silent
  excludedDaysOfUser: {sa: true},           // TODO: write function: getExcludedDaysOfUser !!!
  dayRateOfUser: 480,                       // TODO: wire Function: getDayRateOfuser !!!
  absenceTypeIsHollow: false,               // TODO: write getAccountSettings([hollowAbsenceTypes...
  bundeslandCode: 'HH'                      // TODO: get bundeslandCode from the DB somewhere
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps)
export default connector(AbsenceModal)
