// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import type { User, Store } from 'types/index'
import './styles.css'

type State = {
  view: 'calendar' | 'list',
  currentBranch: string
}

type OwnProps = {
  currentBranch: string
}

type ConProps = {
  users: Array<User>
}

type Props = OwnProps & ConProps

class Absence extends PureComponent {
  props: Props

  render() {
    const { users } = this.props

    return(
      <fb className="absenceCalendarMain">
        <fb className='usersCol'>
          <fb className='usersHeadCell'></fb>
          { users.map(u =>
            <fb className='userCell' key={u.id} data-type='absence-user' data-user={u.id} >{u.name}</fb>
            ) }
        </fb>
        <fb className='calendar'></fb>
      </fb>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  users: state.core.users.filter(u => u.branches[ownProps.currentBranch])
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(Absence)
