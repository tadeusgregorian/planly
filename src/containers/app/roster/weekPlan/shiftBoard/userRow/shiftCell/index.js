//@flow
import React from 'react'
import type { MinimalShift } from 'types/index'
import { shiftCellWidth } from 'constants/roster'
import { shiftToString } from 'helpers/index'
import { type Note } from 'types/index'
import cn from 'classnames'
import './styles.css'

type props = {day: string, user: string, shift: ?MinimalShift, highlighted: boolean, note: ?Note}

export default ({ shift, day, user, highlighted, note }: props) => {
  return(
    <fb className={cn({shiftCellMain: true, highlighted: highlighted})}
      data-target-type='shiftcell'
      data-day={day}
      data-user={user}
      style={{width: shiftCellWidth}}
    >
      <fb className='shiftTimes'>{ shift && shiftToString(shift) }</fb>
      { note  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
      { shift && shift.b && <fb className='breakTime'>{shift.b}</fb> }
    </fb>
  )
}
