//@flow
import React, { PureComponent } from 'react'

import { oTimeCellWidth } from 'constants/roster'
import { weekDays } from 'constants/roster'
import ShiftCell    from './shiftCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import type { User, Shifts, ShiftRef, Position, WeekAbsence } from 'types/index'
import './styles.css'

type Props = {
  user?: User,
  userID: string,
  isOpen: boolean,
  shifts: Shifts,
  durationSum: number,
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
    const { userID, user, shifts, shadowedDay, currentUser, focusedShiftRef, shiftUnderMouse, isOpen, position, durationSum, absences } = this.props

    return(
      <fb className="userRowMain">
        <fb className='oTimeBox' style={{width: oTimeCellWidth}} data-type='otime-box' data-user={userID} data-status={'inactive'}>+ 20:10</fb>
        { (!isOpen && user) ? <UserCell user={user} position={position} durationSum={durationSum} /> : <OpenUserCell /> }
        <fb className='ShiftCellsWrapper'>
          { weekDays.map((day, dayNum) => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const shadowed        = shadowedDay === day
            const blocked         = !currentUser.isAdmin && currentUser.id !== userID
            const absence         = absences.reduce((acc, abs) => dayNum >= abs.firstWeekDay && dayNum <= abs.lastWeekDay && abs.type , false)
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
