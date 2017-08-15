//@flow
import React, { PureComponent } from 'react'
import type { userType, Shifts } from 'types/index'
import ShiftCell from './shiftCell'
import UserCell from './userCell'
import { shiftToMinimalShift } from 'helpers/index'
import './styles.css'

type propsType = {user: userType, shifts: Shifts}

export default class UserRow extends PureComponent{
  weekDays: Array<string>
  props: propsType

  constructor(p: propsType){
    super(p)
    this.weekDays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
  }

  render(){
    const { user, shifts } = this.props

    return(
      <fb className="userRowMain">
        <UserCell user={user} />
          <fb className='ShiftCellsWrapper'>
            { this.weekDays.map(day => {
              const shift = shifts.find(shift => shift.day === day)
              const minimalShift = shift && shiftToMinimalShift(shift)
              return <ShiftCell day={day} user={user.id} key={day} shift={minimalShift} />
            })}
        </fb>
      </fb>
    )
  }
}
