//@flow
import React, { PureComponent } from 'react'
import ShiftCell from './shiftCell'
import UserCell from './userCell'
import './styles.css'

export default class UserRow extends PureComponent{

  render(){
    return(
      <fb className="userRowMain">
        <UserCell user={this.props.user} />
        <ShiftCell />
        <ShiftCell />
        <ShiftCell />
        <ShiftCell />
        <ShiftCell />
        <ShiftCell />
        <ShiftCell />
      </fb>
    )
  }
}
