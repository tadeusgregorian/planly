//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'

import { generateGuid, getTodaySmart } from 'helpers/index'
import { getEffectiveDays } from './localHelpers'
import type { Store, User, Absence, ExcludedDays } from 'types/index'

import SModal from 'components/sModal'
import './styles.css'

type State = {
  id: string,
  user: string,
  start: number,
  end: number,
  total: number,
  effective: number,
  year: number,
  type: 'vac' | 'ill' | 'extra' | '',
  userNote: ?string,
  adminNote: ?string,
  excludedDays: ?ExcludedDays,
  dayRate: ?number, // number of minutes that get counted to the week-sum for an absence-day
  isHollow: ?true
}

type OwnProps = {
  absence?: Absence,
  userID: string,
  year?: number,
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
      start:        absence ? absence.start   : getTodaySmart(),
      end:          absence ? absence.end     : getTodaySmart(),
      total:        absence ? absence.total   : 1,
      effective:    absence ? absence.total   : getEffectiveDays(getTodaySmart(), getTodaySmart()),
      year:         absence ? absence.year    : (props.year || moment().year()),

      type:         absence ? absence.type          : '',
      userNote:     absence ? absence.type          : '',
      adminNote:    absence ? absence.type          : '',
      excludedDays: absence ? absence.excludedDays  : props.excludedDaysOfUser,
      dayRate:      absence ? absence.dayRate       : props.dayRateOfUser, // number of minutes that get counted to the week-sum for an absence-day
      isHollow:     absence ? absence.isHollow      : null
    }
  }

  saveClicked = () => {
    this.props.closeModal()
  }

  render(){
    return(
      <SModal.Main onClose={this.props.closeModal} title='Abwesenheit ' >
  			<SModal.Body>
  				<fb className="absenceModalMain">

  				</fb>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  user: (state.core.users.find(u => u.id === ownProps.userID): any), // -> telling Flow to be silent
  excludedDaysOfUser: {sa: true, su: true}, // TODO: write function: getExcludedDaysOfUser !!!
  dayRateOfUser: 480 // TODO: wire Function: getDayRateOfuser !!!
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps)
export default connector(AbsenceModal)
