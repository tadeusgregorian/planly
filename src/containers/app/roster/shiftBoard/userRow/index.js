//@flow
import React, { PureComponent } from 'react'

import { weekDays } from 'constants/roster'
import ShiftCell    from './shiftCell'
import UserCell     from './userCell'
import OpenUserCell from './openUserCell'

import type { User, Shifts, ShiftRef, Position } from 'types/index'
import './styles.css'

type propsType = {
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
}

export default class UserRow extends PureComponent{
  props: propsType

  render(){
    const { userID, user, shifts, shadowedDay, currentUser, focusedShiftRef, shiftUnderMouse, isOpen, position, durationSum } = this.props

    return(
      <fb className="userRowMain">
        { (!isOpen && user) ? <UserCell user={user} position={position} durationSum={durationSum} /> : <OpenUserCell /> }
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
