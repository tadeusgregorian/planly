//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'
import { minToTimeString } from 'helpers/roster'

import type { User, Position } from 'types/index'
import './styles.css'

type Props =  {
  user: User,
  position: ?Position,
  weekSum: number,
  weeklyMins: number,
  timeDetailsVisible: boolean,
}

export default class  extends PureComponent{
  props: Props

  render(){
    const { position, user, weekSum, weeklyMins, timeDetailsVisible } = this.props
    const color     = position && position.color
    const shortcut  = position && position.shortcut
    const posStyle = { color: color, borderColor: color }
    const sollTime = Math.round((weeklyMins / 60) * 100) / 100
    const negative = weekSum < weeklyMins
    const positive = weekSum > weeklyMins

    return(
      <fb className="userCellMain">
        <fb className='posBox' style={posStyle}>{shortcut}</fb>
        <fb className={cn({userName: 1, big: !timeDetailsVisible})}>{user.name}</fb>
        <fb className={cn({times: 1, hidden: !timeDetailsVisible})}>
          <fb className='currentWeek'>
            <fb className={cn({ istTime: 1, negative, positive })}  >{minToTimeString(weekSum)}</fb>
            <fb className='sollTime'>{' / ' + sollTime + ' h'}</fb>
          </fb>
        </fb>
      </fb>
    )
  }
}
