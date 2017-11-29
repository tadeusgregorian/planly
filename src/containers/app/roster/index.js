// @flow
import React, { PureComponent } from 'react'
import WeekPlan from './weekPlan'
import SubBar from './subBar'
import type { User } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User
}


export default class Roster extends PureComponent {
  props: Props

  render() {
    const { currentUser } = this.props
    const { isAdmin, branches } = currentUser

    const subBarVisible = isAdmin || Object.values(branches).length > 1

    return(
      <fb className="rosterMain">
        { subBarVisible && <SubBar /> }
        <WeekPlan />
      </fb>
    )
  }
}
