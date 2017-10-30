//@flow

import React from 'react'
//import type { PreShift } from 'types/index'
//import { shiftCellWidth } from 'constants/roster'
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

export default (props: Props) => {
  const hasNote = !!props.hasNote ? ' highlighted' : ''
  const { isAdmin, withLocations, toggleLocationBox } = props

  return(
    <fb className="shiftActionBarMain">
      { isAdmin && <fb className='btn deleteBtn icon icon-delete' onClick={props.deleteShift} /> }
      { withLocations && isAdmin && <fb className='btn locationBtn icon icon-download' onClick={toggleLocationBox} /> }
      <fb className={'btn noteBtn icon icon-comment' + hasNote} onClick={props.showShiftNote} />
      <fb className='btn optionsBtn icon icon-done'   onClick={props.saveIt}></fb>
      <fb className='btn closeBtn icon icon-close'    onClick={props.unfocusShift}></fb>
    </fb>
  )
}
