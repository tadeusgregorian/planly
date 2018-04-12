//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import WeeklyTimes from './weeklyTimes'
import MonthlyTimes from './monthlyTimes'
import cn from 'classnames'

import type { User, Position } from 'types/index'
import './styles.css'

type OwnProps =  {
  user: User,
  currentUser: User,
  position: ?Position,
  weekSum: number,
  weeklyMins: number,
  timeDetailsVisible: boolean,
  ghost: boolean,
  currentWeekID: string,
}

type ConProps = {}
type Props = OwnProps & ConProps

export default class UserCell extends PureComponent{
  props: Props

  render(){
    const { position, user, weekSum, weeklyMins, timeDetailsVisible, currentUser, ghost, currentWeekID } = this.props
    const color     = position && position.color
    const shortcut  = position && position.shortcut
    const posStyle = { color: color, borderColor: color }
    const cUser = currentUser
    const showTimeDetails = timeDetailsVisible && (cUser.isAdmin || cUser.id === user.id)
    const showWeeklyTimes = showTimeDetails && !user.monthly
    const showMonthlyTimes = showTimeDetails && user.monthly

    return(
      <fb className="userCellMain">
        <fb className='posBox' style={posStyle}>{shortcut}</fb>
        <fb className={cn({userName: 1, big: !timeDetailsVisible, inActive: ghost })}>{user.name}</fb>
        { showWeeklyTimes && <WeeklyTimes weeklyMins={weeklyMins} weekSum={weekSum} /> }
        { showMonthlyTimes && <MonthlyTimes user={user} currentWeekID={currentWeekID} /> }
      </fb>
    )
  }
}
