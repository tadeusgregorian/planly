//@flow
import React, { PureComponent } from 'react'

import { weekDays } from 'constants/roster'
import ShiftCell    from './shiftCell'
import OvertimeCell from './overtimeCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import { calculateWeekSum } from './localHelpers'

import type { User, Shifts, ShiftRef, Position, AbsenceWeekly, OvertimeStatus, ExtraHours, CellRef } from 'types/index'
import './styles.css'

type Props = {
  user?: User,
  userID: string,
  isOpen: boolean,
  shifts: Shifts,
  currentWeekID: string,
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
  weeklyMins: ?number,
  ghost: boolean,
  shiftOverlaps: {[shiftID: string]: string},
  absences: Array<AbsenceWeekly>
}

export default class UserRow extends PureComponent{
  props: Props

  render(){
    const {
      user,
      userID, // we cant just pass user-Object here ( cause userObj might be null in case of openShiftsRow !)
      isOpen,
      shifts,
      currentWeekID,
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
      weeklyMins,
      absences,
      shiftOverlaps,
      ghost } = this.props

      const isAdmin        = currentUser.isAdmin
      const isOwnRow       = currentUser.id === userID
      const weekSum        = templateMode ? calculateWeekSum(shifts) : this.props.weekSum
      const isAuthorized   = isAdmin || isOwnRow
      const userIsMonthly  = user ? !!user.monthly : false

    return(
      <fb className="userRowMain">
        { !templateMode && timeDetailsVisible && !userIsMonthly &&
          <OvertimeCell
            overtime={overtime}
            status={overtimeStatus}
            type='PRE'
            empty={isOpen || !isAuthorized}
            userID={userID}
          />
        }
        { (!isOpen && user)
          ? <UserCell
              user={user}
              position={position}
              weekSum={weekSum}
              weeklyMins={(weeklyMins || 0)}
              overtime={overtime}
              currentUser={currentUser}
              timeDetailsVisible={timeDetailsVisible}
              currentWeekID={currentWeekID}
              ghost={ghost}
            />
          : <OpenUserCell />
        }
        <fb className='shiftCellsWrapper'>
          { weekDays.map((day, dayNum) => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const extraHoursOfDay = (isAdmin || userID === currentUser.id) ? extraHours.filter(s => s.day === day) : [] // we do find / not filter -> not more than one per day possible !
            const shadowed        = shadowedDay === day
            const highlighted     = highlightedDay === day
            const blocked         = !isAdmin && currentUser.id !== userID
            const absence         = absences.find(a => a.firstDay <= dayNum && a.lastDay >= dayNum)
            //const absence         = absences.reduce((acc, abs) => dayNum >= abs.firstWeekDay && dayNum <= abs.lastWeekDay && abs.type , false) // holds the absenceType if is absent
            return <ShiftCell
              day={day}
              user={userID}
              key={day}
              absent={absence && absence.type}
              blocked={blocked}
              shifts={dayShifts}
              shiftOverlaps={shiftOverlaps}
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
          overtime={overtime + weekSum - ( weeklyMins || 0 )}
          status={overtimeStatus}
          type='POST'
          empty={isOpen || !isAuthorized || userIsMonthly}
          userID={userID}
        /> }
      </fb>
    )
  }
}
