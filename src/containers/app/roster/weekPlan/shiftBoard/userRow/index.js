//@flow
import React, { PureComponent } from 'react'
import type { userType, shiftDaysType } from 'types/index'
import ShiftCell from './shiftCell'
import UserCell from './userCell'
import './styles.css'

type propsType = {user: userType, shiftDays: shiftDaysType}

export default class UserRow extends PureComponent{
  weekDays: Array<string>
  props: propsType

  constructor(p: propsType){
    super(p)
    this.weekDays = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']
  }

  render(){
    const { user, shiftDays = {} } = this.props

    return(
      <fb className="userRowMain">
        <UserCell user={user} />
          <fb className='ShiftCellsWrapper'>
            { this.weekDays.map(day =>
              <ShiftCell day={day} user={user.id} key={day} shift={shiftDays[day]} />
            )}
        </fb>
      </fb>
    )
  }
}
