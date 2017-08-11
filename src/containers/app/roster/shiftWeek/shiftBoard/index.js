//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { userType, shiftsType } from 'types/index'
import UserRow from './userRow'
import './styles.css'

class ShiftBoard extends PureComponent{
  props: {
    users: [userType],
    shifts: shiftsType
  }

  render(){
    const { users, shifts } = this.props
    return(
      <fb className="shiftBoardMain">
        {users.map(user =>
          <UserRow user={user} key={user.id} shiftDays={shifts[user.id]}/>
        )}
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.core.users
})

export default connect(mapStateToProps)(ShiftBoard)
