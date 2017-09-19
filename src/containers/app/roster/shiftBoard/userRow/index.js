//@flow
import React, { PureComponent } from 'react'
import type { User, Shifts, Note, ShiftEdits, ShiftRef } from 'types/index'
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
  notes: Array<Note>,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
}

export default class UserRow extends PureComponent{
  props: propsType

  render(){
    const { user, shifts, highlightedDay, notes, shadowedDay, currentUser, shiftEdits, focusedShiftRef } = this.props

    return(
      <fb className="userRowMain">
        <UserCell user={user} />
        <fb className='ShiftCellsWrapper'>
          { weekDays.map(day => {
            const shift           = shifts.find(s => s.day === day)
            const shiftEdit       = shiftEdits.find(s => s.day === day)
            const note            = notes.find(n => n.day === day)
            const highlighted     = highlightedDay === day
            const shadowed        = shadowedDay === day
            const blocked         = !currentUser.isAdmin && currentUser.id !== user.id
            return <ShiftCell
              day={day}
              user={user.id}
              key={day}
              blocked={blocked}
              shift={shift}
              shiftEdit={shiftEdit}
              shiftType='usershift'
              note={note}
              shadowed={shadowed}
              focusedShiftRef={focusedShiftRef && focusedShiftRef.day === day ? focusedShiftRef : null}
              highlighted={highlighted} />
          })}
        </fb>
      </fb>
    )
  }
}
