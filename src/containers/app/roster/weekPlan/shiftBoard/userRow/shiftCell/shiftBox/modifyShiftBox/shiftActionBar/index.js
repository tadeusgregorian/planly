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
}

export default (props: Props) => {
  const hasNote = !!props.hasNote ? ' highlighted' : ''


  return(
    <fb className="shiftActionBarMain">
      <fb className='btn deleteBtn icon icon-delete' onClick={props.deleteShift}></fb>
      { props.withLocations &&
        <fb className='btn locationBtn icon icon-download' onClick={props.toggleLocationBox} />
      }
      <fb className={'btn noteBtn icon icon-comment' + hasNote} onClick={props.showShiftNote} />
      <fb className='btn optionsBtn icon icon-done'   onClick={props.saveIt}></fb>
      <fb className='btn closeBtn icon icon-close'    onClick={props.unfocusShift}></fb>
    </fb>
  )
}
