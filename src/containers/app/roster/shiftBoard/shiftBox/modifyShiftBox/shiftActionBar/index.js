//@flow

import React from 'react'
import type { Shift } from 'types/index'
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
  shift: Shift,
}

export default (props: Props) => {
  const hasNote = !!props.shift.note ? ' highlighted' : ''

  return(
    <fb className="shiftActionBarMain">
      <fb className='btn deleteBtn icon icon-delete' onClick={props.deleteShift}></fb>
      { props.withLocations &&
        <fb className='btn locationBtn icon icon-download' onClick={props.toggleLocationBox} />
      }
      <fb className='btn optionsBtn icon icon-dehaze' onClick={props.toggleOptions}></fb>
      <fb className={'btn noteBtn icon icon-comment' + hasNote} onClick={props.showShiftNote} />
      <fb className='btn closeBtn icon icon-close' onClick={props.unfocusShift}></fb>
    </fb>
  )
}
