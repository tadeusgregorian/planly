//@flow

import React from 'react'
import type { ShiftRef, Shift } from 'types/index'
import { shiftToString } from 'helpers/index'
import './styles.css'

type Props = {
  shiftRef: ShiftRef,
  shift: ?Shift,
  getRef: (HTMLElement)=>void
}

export default ({ shiftRef, getRef, shift }: Props) => {
  const { dimensions } = shiftRef

  const style = {
    width:    dimensions && dimensions.width,
    height:   dimensions && dimensions.height,
    top:      dimensions && dimensions.top,
    left:     dimensions && dimensions.left
  }

  return(
    <fb className="pickedUpCellMain" style={style} ref={(ref) => getRef(ref)}>
      <fb className='shiftTime'>{shift && shiftToString(shift)}</fb>
    </fb>
  )
}
