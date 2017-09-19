//@flow

import React from 'react'
import type { Shift, ShiftDimensions } from 'types/index'
import { shiftToString } from 'helpers/index'
import './styles.css'

type Props = {
  shift: Shift,
  shift: ShiftDimensions,
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
      <fb className='shiftTime'>{shiftToString(shift)}</fb>
    </fb>
  )
}
