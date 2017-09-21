//@flow
import React, { PureComponent } from 'react'
import type { User, Shifts, ShiftRef } from 'types/index'
import ShiftCell from './shiftCell'
import UserCell from './userCell'
import { weekDays } from 'constants/roster'
import './styles.css'

type propsType = {
  user: User,
  shifts: Shifts,
  shadowedDay: string | false,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
}

export default class UserRow extends PureComponent{
  props: propsType

  render(){
    const { user, shifts, shadowedDay, currentUser, focusedShiftRef, shiftUnderMouse } = this.props

    return(
      <fb className="userRowMain">
        <UserCell user={user} />
        <fb className='ShiftCellsWrapper'>
          { weekDays.map(day => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const shadowed        = shadowedDay === day
            const blocked         = !currentUser.isAdmin && currentUser.id !== user.id
            return <ShiftCell
              day={day}
              user={user.id}
              key={day}
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
