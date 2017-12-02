//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { minToTimeString } from 'helpers/roster'

import type { User, Position } from 'types/index'
import './styles.css'

type Props =  {
  user: User,
  currentUser: User,
  position: ?Position,
  weekSum: number,
  weeklyMins: number,
  timeDetailsVisible: boolean,
  ghost: boolean,
}

export default class  extends PureComponent{
  props: Props

  render(){
    const { position, user, weekSum, weeklyMins, timeDetailsVisible, currentUser, ghost } = this.props
    const color     = position && position.color
    const shortcut  = position && position.shortcut
    const posStyle = { color: color, borderColor: color }
    const sollTime = Math.round((weeklyMins / 60) * 100) / 100
    const negative = weekSum < weeklyMins
    const positive = weekSum > weeklyMins
    const cUser = currentUser
    const showTimeDetails = timeDetailsVisible && (cUser.isAdmin || cUser.id === user.id)

    return(
      <fb className="userCellMain">
        <fb className='posBox' style={posStyle}>{shortcut}</fb>
        <fb className={cn({userName: 1, big: !timeDetailsVisible, inActive: ghost })}>{user.name}</fb>
        <fb className={cn({times: 1, hidden: !showTimeDetails})}>
          <fb className='currentWeek'>
            <fb className={cn({ istTime: 1, negative, positive })}  >{minToTimeString(weekSum)}</fb>
            <fb className='sollTime'>{' / ' + sollTime + ' h'}</fb>
          </fb>
        </fb>
      </fb>
    )
  }
}
