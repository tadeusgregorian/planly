//@flow
import React from 'react'
import type { MinimalShift } from 'types/index'
import { shiftCellWidth, shiftCellHeight } from 'constants/roster'
import { shiftToString } from 'helpers/index'
import { type Note } from 'types/index'
import cn from 'classnames'
import './styles.css'

type props = {
  day: string,
  user: string,
  highlighted?: boolean,
  shadowed?: boolean,
  note?: Note,
  shift?: MinimalShift,
  shiftType?: 'openshift' | 'usershift',
  style?: {},
  cssClass?: string,
}

export default ({ shift, day, user, highlighted, note, shadowed, shiftType, style, cssClass }: props) => {
  return(
    <fb className={cn({shiftCellMain: true, highlighted, shadowed, [cssClass ? cssClass : '']: true })}
      data-target-type='shiftcell'
      data-day={day}
      data-user={user}
      data-shift-type={shiftType ? shiftType : ''}
      style={{width: shiftCellWidth, height: shiftCellHeight, ...style}}
    >
      <fb className='shiftTimes'>{ shift && shiftToString(shift) }</fb>
      { note  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
      { shift && shift.b && <fb className='breakTime'>{shift.b}</fb> }
    </fb>
  )
}
