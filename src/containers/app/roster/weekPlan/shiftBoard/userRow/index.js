//@flow
import React, { PureComponent } from 'react'
import type { User, Shifts, Note } from 'types/index'
import ShiftCell from '../shiftCell'
import UserCell from './userCell'
import { shiftToMinimalShift } from 'helpers/index'
import { weekDays } from 'constants/roster'
import './styles.css'

type propsType = {
  user: User,
  shifts: Shifts,
  highlightedDay: string | false,
  shadowedDay: string | false,
  notes: Array<Note>,
  currentUser: User
}

export default class UserRow extends PureComponent{
  props: propsType


  render(){
    const { user, shifts, highlightedDay, notes, shadowedDay, currentUser } = this.props

    return(
      <fb className="userRowMain">
        <UserCell user={user} />
          <fb className='ShiftCellsWrapper'>
            { weekDays.map(day => {
              const shift         = shifts.find(shift => shift.day === day)
              const minimalShift  = shift && shiftToMinimalShift(shift)
              const note          = notes.find(n => n.day === day)
              const highlighted   = highlightedDay === day
              const shadowed      = shadowedDay === day
              const blocked       = !currentUser.isAdmin && currentUser.id !== user.id
              return <ShiftCell
                day={day}
                user={user.id}
                key={day}
                blocked={blocked}
                shift={minimalShift}
                shiftType='usershift'
                note={note}
                shadowed={shadowed}
                highlighted={highlighted} />
            })}
        </fb>
      </fb>
    )
  }
}
