//@flow
/* eslint radix: off */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { generateGuid } from 'helpers/index'
import { minToTime } from 'helpers/roster'
import { saveExtraHoursToDB } from 'actions/roster/extraHours'

import AbsoluteTimeInput  from 'components/absoluteTimeInput'
import SModal             from 'components/sModal'
import SButton            from 'components/sButton'

import type { Store, User, ExtraHours, Day } from 'types/index'

import './styles.css'

type OwnProps = {
  user: string,
  day: Day,
  id: string,
  closeModal: ()=>{},
}

type ConProps = {
  extraHours: ?ExtraHours,
  users: Array<User>,
  saveExtraHoursToDB: (ExtraHours, ?boolean)=>any,
}

type State = {
  negative: boolean,
  hours: string,
  minutes: string,
  note: string,
}

class ExtraHoursModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    const eH = this.props.extraHours

    this.state = {
      negative:   eH ? eH.mins < 0                           : false,
      hours:      eH ? minToTime(eH.mins).hours.toString()   : '',
      minutes:    eH ? minToTime(eH.mins).minutes.toString() : '',
      note:       eH ? (eH.note || '')                       : '' ,
    }
  }

  saveClicked = () => {
    const { hours, minutes, negative, note } = this.state
    const { user, day, extraHours } = this.props

    const mins = ((parseInt((hours || 0)) * 60) + parseInt(minutes || 0)) * ( negative ? -1 : 1)
    const id = extraHours ? extraHours.id : generateGuid()
    const newExtraHours = { id, user, day, mins, note: note || null }

    this.props.saveExtraHoursToDB(newExtraHours)
    this.props.closeModal()
  }

  removeClicked = () => {
    if(!this.props.extraHours) return // this should never happen.
    this.props.saveExtraHoursToDB(this.props.extraHours, true)
    this.props.closeModal()
  }

  render(){
    const { users, user, extraHours } = this.props
    const { negative, hours, minutes } = this.state
    const userObj = users.find(u => u.id === user )
    const userName = userObj ? userObj.name : '...'

    return(
      <SModal.Main onClose={this.props.closeModal} title='Überstunden'>
  			<SModal.Body>
  				<fb className="oTimeCorrectionModalMain">
            <fb className='explenationText'>
              { `Wie viele Extrastunden soll ${userName} erhalten ?` }
            </fb>
            <AbsoluteTimeInput
              negative={negative}
              hours={hours}
              minutes={minutes}
              negativeChanged={(negative)=>this.setState({negative})}
              hoursChanged={(hours)=>this.setState({hours})}
              minutesChanged={(minutes)=>this.setState({minutes})}
            />
  				</fb>
          <SModal.Footer>
            { extraHours && <SButton label='entfernen'   onClick={this.removeClicked} grey left /> }
            <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  saveExtraHoursToDB
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  extraHours: state.roster.extraHours.find(eh => eh.id === ownProps.id ),
  users: state.core.users
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(ExtraHoursModal)
