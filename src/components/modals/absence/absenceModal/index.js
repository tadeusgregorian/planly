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
  type: 'vac' | 'ill' | 'extra',
  userNote: ?string,
  adminNote: ?string,
  excludedDays: ?ExcludedDays,
  dayRate: ?number, // number of minutes that get counted to the week-sum for an absence-day
  neglectingRate: ?true
}

type OwnProps = {
  absence?: Absence,
  userID: string,
  year?: number,
  closeModal: ()=>{},
}

type ConProps = {
  user: User
}

class AbsenceModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props){
    super(props)
    this.state = {
      id:        props.absence ? props.absence.id      : generateGuid(),
      start:     props.absence ? props.absence.start   : getTodaySmart(),
      end:       props.absence ? props.absence.end     : getTodaySmart(),
      total:     props.absence ? props.absence.total   : 1,
      effective: props.absence ? props.absence.total   : getEffectiveDays(getTodaySmart(), getTodaySmart()),
      year:      props.absence ? props.absence.year    : (props.year || moment().year()),
      
      type: 'vac' | 'ill' | 'extra',
      userNote: ?string,
      adminNote: ?string,
      excludedDays: ?ExcludedDays,
      dayRate: ?number, // number of minutes that get counted to the week-sum for an absence-day
      neglectingRate: ?true
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
  user: (state.core.users.find(u => u.id === ownProps.userID): any) // -> telling Flow to be silent
})

const connector: Connector<OwnProps, OwnProps & ConProps > = connect(mapStateToProps)
export default connector(AbsenceModal)
