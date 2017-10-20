//@flow
import React, { PureComponent } from 'react'

import { weekDays } from 'constants/roster'
import ShiftCell    from './shiftCell'
import OvertimeCell from './overtimeCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import type { User, Shifts, ShiftRef, Position, WeekAbsence, Correction } from 'types/index'
import './styles.css'

type Props = {
  user?: User,
  userID: string,
  isOpen: boolean,
  shifts: Shifts,
  weekSum: number,
  overtime: ?number,
  correction: ?Correction,
  position: ?Position,
  shadowedDay: string | false,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
  absences: Array<WeekAbsence>,
}

export default class UserRow extends PureComponent{
  props: Props

  render(){
    const {
      user,
      userID, // we cant just pass user-Object here ( cause userObj might be null in case of openShiftsRow !)
      isOpen,
      shifts,
      weekSum,
      overtime,
      correction,
      position,
      shadowedDay,
      currentUser,
      focusedShiftRef,
      shiftUnderMouse,
      absences } = this.props

    return(
      <fb className="userRowMain">
        <OvertimeCell
          overtime={overtime}
          userID={userID}
          correction={correction} 
        />
        { (!isOpen && user)
          ? <UserCell
              user={user}
              position={position}
              weekSum={weekSum}
              overtime={overtime}
            />
          : <OpenUserCell />
        }
        <fb className='ShiftCellsWrapper'>
          { weekDays.map((day, dayNum) => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const shadowed        = shadowedDay === day
            const blocked         = !currentUser.isAdmin && currentUser.id !== userID
            const absence         = absences.reduce((acc, abs) => dayNum >= abs.firstWeekDay && dayNum <= abs.lastWeekDay && abs.type , false) // holds the absenceType if is absent
            return <ShiftCell
              day={day}
              user={userID}
              key={day}
              absence={absence}
              isOpen={isOpen}
              blocked={blocked}
              shifts={dayShifts}
              shiftType='usershift'
              shadowed={shadowed}
              focusedShiftRef={focusedShiftRef && focusedShiftRef.day === day ? focusedShiftRef : null}
              shiftUnderMouse={shiftUnderMouse && shiftUnderMouse.day === day ? shiftUnderMouse : null}
            />
          })}
        </fb>
      </fb>
    )
  }
}
