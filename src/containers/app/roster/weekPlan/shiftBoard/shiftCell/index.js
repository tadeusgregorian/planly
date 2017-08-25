//@flow
import React from 'react'
import type { MinimalShift, Note, Position, ShiftEdit } from 'types/index'
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
  shiftEdit?: ShiftEdit,
  position?: Position, // for open Shifts only
  shiftType: 'openshift' | 'usershift',
  style?: {},
  cssClasses?: Array<string>,
  blocked?: ?boolean, // indicates if the currentUser has permission to focus this cell.
}

const ShiftCell = ({ shift, day, user, highlighted, note, shadowed, shiftType, style, cssClasses, position, blocked, shiftEdit }: Props) => {
  //shift && console.log(typeof shift.b);
  const editedStyle = { width: shiftCellWidth - 3, height: shiftCellHeight - 3}
  const posInitials = position && position.name.substr(0, 2)
  const posBoxStyle = position && {
     color: position.color,
     height: shiftCellHeight - 3,
     backgroundColor: shadeColor(position.color, 0.8)
   }
   const cssClassesObj = cssClasses ? cssClasses.reduce((acc, val) => ({ ...acc, [val]: true }), {}) : {} // turnes the classesArray to an obj for classnames
  return(
    <fb className={cn({shiftCellMain: true, highlighted, shadowed, ...cssClassesObj })}
      data-target-type='shiftcell'
      data-day={day}
      data-user={user}
      data-shift-type={shiftType ? shiftType : ''}
      data-clickable={blocked ? 'blocked' : 'true'}
      data-has-shift={shift ? 'true' : ''}
      data-has-edit={shiftEdit ? 'true' : ''}
      style={{width: shiftCellWidth, height: shiftCellHeight, ...style}}
    >
      <fb className='shiftTimes'>{ shift && shiftToString(shift) }</fb>
      { position && <fb className='posBox' style={posBoxStyle} >{posInitials}</fb> }
      { note  && <icon className='icon icon-comment hasNoteCellIcon' data-day={day} data-user={user} data-target-type='noteicon' />}
      { shift && !!shift.b && <fb className='breakTime'>{shift.b}</fb> }
      { shiftEdit && <fb className='edited icon icon-pen' style={editedStyle}></fb> }
    </fb>
  )
}

export default ShiftCell
