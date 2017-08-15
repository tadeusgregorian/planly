//@flow
import React from 'react'
import type { MinimalShift } from 'types/index'
import { shiftCellWidth } from 'constants/roster'
import { shiftToString } from 'helpers/index'
import './styles.css'

type props = {day: string, user: string, shift: ?MinimalShift}

export default ({shift, day, user}: props) => {

  return(
    <fb className="shiftCellMain" data-celltype='shiftcell' data-day={day} data-user={user} style={{width: shiftCellWidth}}>
      { shift && shiftToString(shift) }
    </fb>
  )
}
