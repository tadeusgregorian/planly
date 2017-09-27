//@flow
import React, { PureComponent } from 'react'
import type { User, Shifts, ShiftRef } from 'types/index'

import ShiftCell    from './shiftCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import { weekDays } from 'constants/roster'
import './styles.css'

type propsType = {
  user?: User,
  userID: string,
  isOpen: boolean,
  shifts: Shifts,
  shadowedDay: string | false,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
}

export default class UserRow extends PureComponent{
  props: propsType

  render(){
    const { userID, user, shifts, shadowedDay, currentUser, focusedShiftRef, shiftUnderMouse, isOpen } = this.props

    return(
      <fb className="userRowMain">
        { (!isOpen && user) ? <UserCell user={user} /> : <OpenUserCell /> }
        <fb className='ShiftCellsWrapper'>
          { weekDays.map(day => {
            const dayShifts       = shifts.filter(s => s.day === day)
            const shadowed        = shadowedDay === day
            const blocked         = !currentUser.isAdmin && currentUser.id !== userID
            return <ShiftCell
              day={day}
              user={userID}
              key={day}
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
