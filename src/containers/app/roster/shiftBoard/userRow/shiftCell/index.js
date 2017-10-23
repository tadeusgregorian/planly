//@flow
import React, { PureComponent } from 'react'
import type { Shift, Shifts, Position, ShiftRef, Day, AbsenceType, ExtraHours } from 'types/index'
import { shiftCellWidth } from 'constants/roster'
import ExtraHoursBox from './extraHoursBox'
import ShiftBox from '../../shiftBox'
import cn from 'classnames'
import './styles.css'

type Props = {
  day: Day,
  user: string,
  isOpen: boolean,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
  absence: AbsenceType | false,
  shadowed?: boolean,
  highlighted?: boolean,
  shifts: Shifts,
  extraHours: ?ExtraHours,
  position?: Position, // for open Shifts only
  shiftType: 'openshift' | 'usershift',
  style?: {},
  cssClasses?: Array<string>,
  blocked?: ?boolean, // indicates if the currentUser has permission to focus this cell.
}

export default class ShiftCell extends PureComponent {
  props: Props

  render(){
    const {
      shifts,
      extraHours,
      day,
      user,
      shadowed,
      shiftType,
      style,
      cssClasses,
      blocked,
      focusedShiftRef,
      shiftUnderMouse,
      isOpen,
      absence,
      highlighted } = this.props

    const inCreation       = focusedShiftRef && focusedShiftRef.inCreation
    const focusedShiftID   = focusedShiftRef ? focusedShiftRef.id : 'aRondomStringTade...'
    const dummyShift:Shift = { s: 0, e: 0, b: 0, user, day, id: focusedShiftID, isOpen: isOpen }
    const cssClassesObj    = cssClasses ? cssClasses.reduce((acc, val) => ({ ...acc, [val]: true }), {}) : {} // turnes the classesArray to an obj for classnames
    const absenceIconClass = absence && (absence === 'ill' ? 'icon icon-heart' : 'icon icon-rocket')

    return(
      <fb className={cn({shiftCellMain: true, shadowed, highlighted, ...cssClassesObj })}
        data-target-type='shiftcell'
        data-day={day}
        data-user={user}
        data-shift-type={shiftType}
        data-clickable={blocked ? 'blocked' : 'true'}
        data-has-shift={(shifts.length || inCreation || extraHours) ? 'true' : ''}
        data-has-focus={focusedShiftRef ? 'true' : ''}
        style={{width: shiftCellWidth, ...style}}
      >
        { shifts.map((shift, i) =>
          <ShiftBox
            key={shift.id}
            shift={shift}
            focused={   !!focusedShiftRef && focusedShiftRef.id === shift.id}
            isHovered={ !!shiftUnderMouse && shiftUnderMouse.id === shift.id && !focusedShiftRef && i === shifts.length - 1}  />
        )}
        { inCreation  && <ShiftBox shift={dummyShift} focused inCreation/> }
        { extraHours  && <ExtraHoursBox extraHours={extraHours} /> }
        { shadowed    && <fb className='dropZone'></fb> }
        { absence     && !focusedShiftRef && <fb className='absenceLayer'><fb className={absenceIconClass} /></fb> }
        { highlighted && <fb className='highlighted' />}
      </fb>
    )
  }
}
