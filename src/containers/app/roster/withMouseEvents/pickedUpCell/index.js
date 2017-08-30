//@flow

import React from 'react'
import type { ShiftCell, Shift } from 'types/index'
import { shiftToString } from 'helpers/index'
import './styles.css'

type Props = {
  cell: ShiftCell,
  shift: ?Shift,
  getRef: (HTMLElement)=>void
}

export default ({ cell, shift, getRef }: Props) => {

  const style = {
    width:    cell.width,
    height:   cell.height,
    top:      cell.top,
    left:     cell.left
  }

  return(
    <fb className="pickedUpCellMain" style={style} ref={(ref) => getRef(ref)}>
      { shift && <fb className='shiftTime'>{shiftToString(shift)}</fb>}
      { !!shift && !!shift.b && <fb className='breakTime'>{shift.b}</fb> }
    </fb>
  )
}
