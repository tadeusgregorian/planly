//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'
import { saveCorrectionToDB } from 'actions/roster/overtime'

import SModal from 'components/sModal'
import SButton from 'components/sButton'
import { isIntStr } from 'helpers/index'
import type { Store, User } from 'types/index'

import './styles.css'

type OwnProps = {
  user: string,
  isInitial: boolean,
  closeModal: ()=>{},
}

type ConProps = {
  currentWeekID: string,
  users: Array<User>,
}

type State = {
  negative: boolean,
  hours: string,
  minutes: string,
  note: string,
}

class OTimeCorrectionModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    this.state = {
      negative: false,
      hours: '',
      minutes: '',
      note: '',
    }
  }

  saveClicked = () => {
    const { hours, minutes, negative, note } = this.state
    const { user, currentWeekID, isInitial } = this.props
    const mins = ((parseInt(hours, 10) * 60) + parseInt(minutes, 10)) * ( negative ? -1 : 1)
    const initial = isInitial ? true : null
    const noteDB = note || null

    const correction = { user, week: currentWeekID, initial, mins, note: noteDB }

    saveCorrectionToDB(correction)
    this.props.closeModal()
  }

  hoursChanged = (e) => isIntStr(e.target.value) && this.setState({hours: e.target.value})
  minutesChanged = (e) => isIntStr(e.target.value) && this.setState({minutes: e.target.value})

  minusClicked = () => { this.setState({negative: true })}
  plusClicked = () => { this.setState({negative: false })}

  render(){
    const { isInitial, users, user, currentWeekID } = this.props
    const { negative, hours, minutes } = this.state
    const userObj = users.find(u => u.id === user )
    const userName = userObj ? userObj.name : '...'
    const week = currentWeekID.toString().slice(-2)

    return(
      <SModal.Main onClose={this.props.closeModal} title='Überstunden'>
  			<SModal.Body>
  				<fb className="oTimeCorrectionModalMain">
            <fb className='explenationText'>
              { isInitial && `Gib den Stand des Überstundenkontos von ${userName} zu Beginn der Kalenderwoche ${week} ein.` }
            </fb>
            <fb className='mainInputWrapper'>
              <fb className='minusPlusWrapper'>
                <fb className={cn({minus: 1, option: 1, selected: negative})} onClick={this.minusClicked}>-</fb>
                <fb className={cn({plus: 1, option: 1, selected: !negative})} onClick={this.plusClicked}>+</fb>
              </fb>
              <fb className='timesWrapper'>
                <fb className='inputWrapper hours'><input type='text' value={hours} onChange={this.hoursChanged}/></fb>
                <fb className='unit'>Std</fb>
                <fb className='inputWrapper minutes'><input type='text' value={minutes} onChange={this.minutesChanged } maxLength='2'/></fb>
                <fb className='unit'>Min</fb>
              </fb>
            </fb>
  				</fb>
          <SModal.Footer>
            <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
            <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const actionCreators = {

}

const mapStateToProps = (state: Store) => ({
  currentWeekID: state.ui.roster.currentWeekID,
  users: state.core.users
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(OTimeCorrectionModal)
