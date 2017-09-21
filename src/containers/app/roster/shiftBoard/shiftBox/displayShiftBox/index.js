//@flow
import React, { PureComponent } from 'react'
import type { Shift } from 'types/index'

import ShiftEditBar from '../shiftEditBar'
import ShiftTimesBar from '../shiftTimesBar'
import './styles.css'

type Props = {
  shift: Shift,
  isHovered?: boolean
}

export default class DisplayShiftBox extends PureComponent{
  props: Props

  render(){
    const { shift, isHovered } = this.props
    const { day, user, id, note } = shift

    return(
      <fb className='displayShiftBoxMain' data-target-type='shift' data-day={day} data-user={user} data-shift-id={id} data-has-edit={!!shift.edit} >
        { note && <fb className='noteIcon icon icon-comment' /> }
        <ShiftTimesBar shift={shift} />
        { shift.edit && <ShiftEditBar shift={shift} /> }
        { isHovered && <fb className='extendCellBtn' data-target-type='extend-cell-btn'>+</fb> }
      </fb>
    )
  }
}
