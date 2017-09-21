//@flow
import React from 'react'
import type { Shift } from 'types/index'
import { shiftToString } from 'helpers/roster'

import './styles.css'

type Props = {
  shift: Shift
}

export default ({shift}: Props) => {

  return(
    <fb className='shiftTimesBarMain'>
      <fb className='shiftTimes'>{shiftToString(shift)}</fb>
      { !!shift.b && <fb className='breakTime'>{'/ ' + shift.b}</fb> }
    </fb>
  )
}
