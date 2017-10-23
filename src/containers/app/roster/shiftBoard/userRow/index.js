//@flow
import React, { PureComponent } from 'react'

import { weekDays } from 'constants/roster'
import ShiftCell    from './shiftCell'
import OvertimeCell from './overtimeCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import type { User, Shifts, ShiftRef, Position, WeekAbsence, OvertimeStatus, ExtraHours } from 'types/index'
import './styles.css'

type Props = {
  user?: User,
  userID: string,
  isOpen: boolean,
  shifts: Shifts,
  extraHours: Array<ExtraHours>,
  weekSum: number,
  overtime: ?number,
  overtimeStatus: OvertimeStatus,
  position: ?Position,
  shadowedDay: string | false,
  highlightedDay: string | false,
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
      extraHours,
      weekSum,
      overtime,
      overtimeStatus,
      position,
      shadowedDay,
      highlightedDay,
      currentUser,
      focusedShiftRef,
      shiftUnderMouse,
      absences } = this.props

      const weeklyMins = user ? user.weeklyMins : 0

    return(
      <fb className="userRowMain">
        <OvertimeCell
          overtime={overtime}
          status={overtimeStatus}
          type='PRE'
          userID={userID}
        />
        { (!isOpen && user)
          ? <UserCell
              user={user}
              position={position}
              weekSum={weekSum}
              weeklyMins={weeklyMins}
              overtime={overtime}
            />
          : <OpenUserCell />
        }
        <fb className='shiftCellsWrapper'>
          { weekDays.map((day, dayNum) => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const extraHoursOfDay = extraHours.find(s => s.day === day) // we do find / not filter -> not more than one per day possible !
            const shadowed        = shadowedDay === day
            const highlighted     = highlightedDay === day
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
              extraHours={extraHoursOfDay}
              shiftType='usershift'
              shadowed={shadowed}
              highlighted={highlighted}
              focusedShiftRef={focusedShiftRef && focusedShiftRef.day === day ? focusedShiftRef : null}
              shiftUnderMouse={shiftUnderMouse && shiftUnderMouse.day === day ? shiftUnderMouse : null}
            />
          })}
        </fb>
        <OvertimeCell
          overtime={overtime + weekSum - weeklyMins}
          status={overtimeStatus}
          type='POST'
          userID={userID}
        />
      </fb>
    )
  }
}
