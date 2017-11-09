//@flow
import React, { PureComponent } from 'react'

import { weekDays } from 'constants/roster'
import ShiftCell    from './shiftCell'
import OvertimeCell from './overtimeCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import { calculateWeekSum } from './localHelpers'

import type { User, Shifts, ShiftRef, Position, WeekAbsence, OvertimeStatus, ExtraHours, CellRef } from 'types/index'
import './styles.css'

type Props = {
  user?: User,
  userID: string,
  isOpen: boolean,
  shifts: Shifts,
  extraHours: Array<ExtraHours>,
  templateMode: boolean,
  timeDetailsVisible: boolean,
  weekSum: number,
  overtime: ?number,
  overtimeStatus: OvertimeStatus,
  position: ?Position,
  shadowedDay: string | false,
  highlightedDay: string | false,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
  cellUnderMouse: ?CellRef,
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
      templateMode,
      timeDetailsVisible,
      overtime,
      overtimeStatus,
      position,
      shadowedDay,
      highlightedDay,
      currentUser,
      focusedShiftRef,
      cellUnderMouse,
      absences } = this.props

      const isAdmin     = currentUser.isAdmin
      const weeklyMins  = user ? user.weeklyMins : 0
      const weekSum     = templateMode ? calculateWeekSum(shifts) : this.props.weekSum

    return(
      <fb className="userRowMain">
        { !templateMode && timeDetailsVisible &&
          <OvertimeCell
            overtime={overtime}
            status={overtimeStatus}
            type='PRE'
            empty={isOpen}
            userID={userID}
          />
        }
        { (!isOpen && user)
          ? <UserCell
              user={user}
              position={position}
              weekSum={weekSum}
              weeklyMins={weeklyMins}
              overtime={overtime}
              timeDetailsVisible={timeDetailsVisible}
            />
          : <OpenUserCell />
        }
        <fb className='shiftCellsWrapper'>
          { weekDays.map((day, dayNum) => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const extraHoursOfDay = (isAdmin || userID === currentUser.id) ? extraHours.find(s => s.day === day) : null // we do find / not filter -> not more than one per day possible !
            const shadowed        = shadowedDay === day
            const highlighted     = highlightedDay === day
            const blocked         = !isAdmin && currentUser.id !== userID
            const absence         = absences.reduce((acc, abs) => dayNum >= abs.firstWeekDay && dayNum <= abs.lastWeekDay && abs.type , false) // holds the absenceType if is absent
            return <ShiftCell
              day={day}
              user={userID}
              key={day}
              absence={absence}
              blocked={blocked}
              shifts={dayShifts}
              extraHours={extraHoursOfDay}
              shiftType='usershift'
              shadowed={shadowed}
              highlighted={highlighted}
              focusedShiftRef={focusedShiftRef}
              templateMode={templateMode}
              hovered={!!(cellUnderMouse && cellUnderMouse.day === day)}
            />
          })}
        </fb>
        { !templateMode && timeDetailsVisible && <OvertimeCell
          overtime={overtime + weekSum - weeklyMins}
          status={overtimeStatus}
          type='POST'
          empty={isOpen}
          userID={userID}
        /> }
      </fb>
    )
  }
}
