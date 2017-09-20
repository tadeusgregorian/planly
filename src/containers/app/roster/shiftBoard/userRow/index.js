//@flow
import React, { PureComponent } from 'react'
import type { User, Shifts, ShiftEdits, ShiftRef } from 'types/index'
import ShiftCell from './shiftCell'
import UserCell from './userCell'
import { weekDays } from 'constants/roster'
import './styles.css'

type propsType = {
  user: User,
  shifts: Shifts,
  shiftEdits: ShiftEdits,
  highlightedDay: string | false,
  shadowedDay: string | false,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
}

export default class UserRow extends PureComponent{
  props: propsType

  render(){
    const { user, shifts, highlightedDay, shadowedDay, currentUser, shiftEdits, focusedShiftRef, shiftUnderMouse } = this.props

    return(
      <fb className="userRowMain">
        <UserCell user={user} />
        <fb className='ShiftCellsWrapper'>
          { weekDays.map(day => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const shiftEdit       = shiftEdits.find(s => s.day === day)
            const highlighted     = highlightedDay === day
            const shadowed        = shadowedDay === day
            const blocked         = !currentUser.isAdmin && currentUser.id !== user.id
            return <ShiftCell
              day={day}
              user={user.id}
              key={day}
              blocked={blocked}
              shifts={dayShifts}
              shiftEdit={shiftEdit}
              shiftType='usershift'
              shadowed={shadowed}
              focusedShiftRef={focusedShiftRef && focusedShiftRef.day === day ? focusedShiftRef : null}
              shiftUnderMouse={shiftUnderMouse && shiftUnderMouse.day === day ? shiftUnderMouse : null}
              highlighted={highlighted} />
          })}
        </fb>
      </fb>
    )
  }
}
