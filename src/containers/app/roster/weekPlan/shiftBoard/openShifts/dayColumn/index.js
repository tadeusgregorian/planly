//@flow

import React from 'react'
import { shiftCellWidth } from 'constants/roster'
import ShiftCell from '../../shiftCell'
import './styles.css'

type Props = {
  day: string,
}

export default (props: Props) => {



  return(
    <fb className="openShiftsDayColumnMain" style={{width: shiftCellWidth}}>
      <ShiftCell
        user={'open'}
        day={props.day}
      />
    </fb>
  )
}
