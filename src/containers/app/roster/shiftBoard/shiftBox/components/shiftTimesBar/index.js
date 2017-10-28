//@flow
import React from 'react'
import type { PreShift } from 'types/index'
import { shiftToString } from 'helpers/roster'

import './styles.css'

type Props = {
  shift: PreShift
}

export default ({shift}: Props) => {

  return(
    <fb className='shiftTimesBarMain'>
      <fb className='shiftTimes'>{shiftToString(shift)}</fb>
      { !!shift.b && <fb className='breakTime'>{'/ ' + shift.b}</fb> }
    </fb>
  )
}
