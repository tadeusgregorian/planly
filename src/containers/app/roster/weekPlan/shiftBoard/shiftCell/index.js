//@flow
import React from 'react'
import type { MinimalShift, Note, Position } from 'types/index'
import { shiftCellWidth, shiftCellHeight } from 'constants/roster'
import { shiftToString, shadeColor } from 'helpers/index'
import cn from 'classnames'
import './styles.css'

type Props = {
  day: string,
  user: string,
  highlighted?: boolean,
  shadowed?: boolean,
  note?: Note,
  shift?: MinimalShift,
  position?: Position, // for open Shifts only
  shiftType: 'openshift' | 'usershift',
  style?: {},
  cssClass?: string,
}

const ShiftCell = ({ shift, day, user, highlighted, note, shadowed, shiftType, style, cssClass, position }: Props) => {
  const posInitials = position && position.name.substr(0, 2)
  const posBoxStyle = position && {
     color: position.color,
     height: shiftCellHeight - 3,
     backgroundColor: shadeColor(position.color, 0.8)
   }
  return(
    <fb className={cn({shiftCellMain: true, highlighted, shadowed, [cssClass ? cssClass : '']: true })}
      data-target-type='shiftcell'
      data-day={day}
      data-user={user}
      data-shift-type={shiftType ? shiftType : ''}
      style={{width: shiftCellWidth, height: shiftCellHeight, ...style}}
    >
      <fb className='shiftTimes'>{ shift && shiftToString(shift) }</fb>
      { position && <fb className='posBox' style={posBoxStyle} >{posInitials}</fb> }
      { note  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
      { shift && shift.b && <fb className='breakTime'>{shift.b}</fb> }
    </fb>
  )
}

export default ShiftCell
