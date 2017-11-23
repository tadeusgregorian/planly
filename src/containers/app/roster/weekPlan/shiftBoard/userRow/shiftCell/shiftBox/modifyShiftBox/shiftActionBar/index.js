//@flow

import React, { PureComponent } from 'react'
import cn from 'classnames'
import './styles.css'

type Props = {
  inCreation: boolean,
  withLocations: boolean,
  unfocusShift: Function,
  toggleOptions: Function,
  toggleLocationBox: Function,
  showShiftNote: Function,
  deleteShift: Function,
  saveIt: Function,
  hasNote: boolean,
  isAdmin: boolean,
}

export default class ShiftActionBar extends PureComponent {
  props: Props
  state = { fadeIn: false }

  componentDidMount = () => { setTimeout(()=>this.setState({ fadeIn: true }), 1) }

  render(){
    const {
      isAdmin,
      withLocations,
      toggleLocationBox,
      saveIt,
      unfocusShift,
      showShiftNote,
      deleteShift } = this.props
    const hasNote = !!this.props.hasNote ? ' highlighted' : ''
    const { fadeIn } = this.state

    return(
      <fb className={cn({shiftActionBarMain: 1, fadeIn})}>
        { isAdmin && <fb className='btn deleteBtn icon icon-delete' onClick={deleteShift} /> }
        { withLocations && isAdmin && <fb className='btn locationBtn icon icon-download' onClick={toggleLocationBox} /> }
        <fb className={'btn noteBtn icon icon-comment' + hasNote} onClick={showShiftNote} />
        <fb className='btn optionsBtn icon icon-done'   onClick={saveIt}></fb>
        <fb className='btn closeBtn icon icon-close'    onClick={unfocusShift}></fb>
      </fb>
    )
  }
}
