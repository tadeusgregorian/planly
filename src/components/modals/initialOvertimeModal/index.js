//@flow
/* eslint radix: off */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { minToTime } from 'helpers/roster'
import { saveCorrectionToDB, removeCorrectionFromDB } from 'actions/roster/overtime'

import AbsoluteTimeInput  from 'components/absoluteTimeInput'
import SModal             from 'components/sModal'
import SButton            from 'components/sButton'

import type { Store, User, Correction } from 'types/index'

import './styles.css'

type OwnProps = {
  user: string,
  closeModal: ()=>{},
}

type ConProps = {
  currentWeekID: string,
  initialOvertime: ?Correction,
  users: Array<User>,
}

type State = {
  negative: boolean,
  hours: string,
  minutes: string,
  note: string,
}

class InitialOvertimeModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    const io = this.props.initialOvertime

    this.state = {
      negative:   io ? io.mins < 0                           : false,
      hours:      io ? minToTime(io.mins).hours.toString()   : '',
      minutes:    io ? minToTime(io.mins).minutes.toString() : '',
      note:       io ? (io.note || '')                       : '' ,
    }
  }

  saveClicked = () => {
    const { hours, minutes, negative, note } = this.state
    const { user, currentWeekID } = this.props
    const mins = ((parseInt((hours || 0)) * 60) + parseInt(minutes || 0)) * ( negative ? -1 : 1)
    const correction = { user, week: currentWeekID, initial: true , mins, note: note || null }

    saveCorrectionToDB(correction)
    this.props.closeModal()
  }

  removeClicked = () => {
    removeCorrectionFromDB(this.props.user, this.props.currentWeekID)
    this.props.closeModal()
  }



  render(){
    const { users, user, currentWeekID, initialOvertime } = this.props
    const { negative, hours, minutes } = this.state
    const userObj = users.find(u => u.id === user )
    const userName = userObj ? userObj.name : '...'
    const week = currentWeekID.toString().slice(-2)

    return(
      <SModal.Main onClose={this.props.closeModal} title='Überstunden'>
  			<SModal.Body>
  				<fb className="oTimeCorrectionModalMain">
            <fb className='explenationText'>
              { `Gib den Stand des Überstundenkontos von ${userName} zu Beginn der Kalenderwoche ${week} ein.` }
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
            { initialOvertime && <SButton label='entfernen'   onClick={this.removeClicked} grey left /> }
            <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  currentWeekID: state.ui.roster.currentWeekID,
  initialOvertime: state.roster.corrections.find(c => c.user === ownProps.user && c.initial),
  users: state.core.users
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps)
export default connector(InitialOvertimeModal)
