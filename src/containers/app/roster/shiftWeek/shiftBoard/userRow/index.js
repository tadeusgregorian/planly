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
    const shiftDays = this.props.shiftDays || {}

    return(
      <fb className="userRowMain">
        <UserCell user={this.props.user} />
        { this.weekDays.map(day =>
          <ShiftCell day={day} key={day} shift={shiftDays[day]} />
        )}
      </fb>
    )
  }
}
