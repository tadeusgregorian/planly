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
  user: ?string, // user and day are non-null if currently new extraHours are being created!
  day:  ?Day,
  id:   ?string, // id is non-null -> if an existing extraHoursBox was clicked -> Connects finds us the current extraHours Obj
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

  //$FlowFixMe
  getDay = ():Day => this.props.day || this.props.extraHours.day

  //$FlowFixMe
  getUser = ():string => this.props.user || this.props.extraHours.user

  saveClicked = () => {
    const { hours, minutes, negative, note } = this.state
    const { extraHours } = this.props
    const day = this.getDay()
    const user = this.getUser()

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

  noteChanged = (e) => {
    this.setState({note: e.target.value})
  }

  render(){
    const { users, extraHours } = this.props
    const user = this.getUser()
    const { negative, hours, minutes, note } = this.state
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
            <fb className='noteSection'>
              {/* <fb className='label'>Notiz</fb> */}
              <textarea
                type='text'
                value={note}
                onChange={this.noteChanged}
                className='extraHoursInput'
                placeholder='Notiz'
              />
            </fb>
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
