//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { type storeType } from 'types/index'
import UserRow from './userRow'
import './styles.css'

class ShiftBoard extends PureComponent{

  render(){

    return(
      <fb className="shiftBoardMain">
        {this.props.users.map(user => (
          <UserRow user={user} key={user.id} />
        ))}
      </fb>
    )
  }
}

const mapStateToProps = (state: storeType) => ({
  users: state.core.users
})

export default connect(mapStateToProps)(ShiftBoard)
