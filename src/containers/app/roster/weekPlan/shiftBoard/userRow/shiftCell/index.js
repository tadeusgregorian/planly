//@flow
import React from 'react'
import type { shiftType } from 'types/index'
import { shiftCellWidth } from 'constants/roster'
import { shiftToString } from 'helpers/index'
import './styles.css'

type props = {day: string, user: string, shift: ?shiftType}

export default ({shift, day, user}: props) => {

  return(
    <fb className="shiftCellMain" data-celltype='shiftcell' data-day={day} data-user={user} style={{width: shiftCellWidth}}>
      {/* <fb className='testBox'></fb> */}
      { shift && shiftToString(shift) }
    </fb>
  )
}
