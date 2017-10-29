//@flow
import React, { PureComponent } from 'react'
import type { PreShift, Shifts, Position, ShiftRef, Day, AbsenceType, ExtraHours } from 'types/index'
import { shiftCellWidth } from 'constants/roster'
import ExtraHoursBox from './extraHoursBox'
import ShiftBox from './shiftBox'
import cn from 'classnames'
import './styles.css'

type Props = {
  day: Day,
  user: string,
  isOpen: boolean,
  focusedShiftRef: ?ShiftRef,
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
  hovered: boolean,
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
      isOpen,
      absence,
      hovered,
      highlighted } = this.props
    const fsr = this.props.focusedShiftRef

    const focusedShift        = fsr && fsr.day === day && fsr.user === user ? fsr : null
    const inCreation          = focusedShift && focusedShift.inCreation
    const focusedShiftID      = focusedShift ? focusedShift.id : 'aRondomStringTade...'
    const dummyShift:PreShift = { s: 0, e: 0, b: 0, user, day, id: focusedShiftID, isOpen: isOpen }
    const cssClassesObj       = cssClasses ? cssClasses.reduce((acc, val) => ({ ...acc, [val]: true }), {}) : {} // turnes the classesArray to an obj for classnames
    const absenceIconClass    = absence && (absence === 'ill' ? 'icon icon-heart' : 'icon icon-rocket')
    const isEmpty             = !shifts.length && !inCreation && !extraHours
    const showExtendBtn       = hovered && !highlighted && !shadowed && !fsr && !isEmpty
    const showCreateBox       = hovered && !highlighted && !shadowed && !fsr &&  isEmpty

    return(
      <fb className={cn({shiftCellMain: true, shadowed, highlighted, ...cssClassesObj, hovered })}
        data-target-type='shiftcell'
        data-day={day}
        data-user={user}
        data-shift-type={shiftType}
        data-clickable={blocked ?         'blocked' : 'true'}
        data-has-shift={isEmpty ?         ''        : 'true'}
        data-has-focus={focusedShift ? 'true'    : ''}
        style={{width: shiftCellWidth, ...style}}
      >
        { shifts.map((shift, i) =>
          <ShiftBox
            key={shift.id}
            shift={shift}
            focused={   !!focusedShift && focusedShift.id === shift.id} />
        )}
        { inCreation    && <ShiftBox shift={dummyShift} focused inCreation/> }
        { extraHours    && <ExtraHoursBox extraHours={extraHours} /> }
        { showCreateBox && <fb className='createShiftBox'>+</fb> }
        { shadowed      && <fb className='dropZone'></fb> }
        { absence       && !focusedShift && <fb className='absenceLayer'><fb className={absenceIconClass} /></fb> }
        { highlighted   && <fb className='highlightedCell' />}
        { showExtendBtn && <fb className='extendCellBtn' data-type='extend-cell-btn'>+</fb> }
      </fb>
    )
  }
}
