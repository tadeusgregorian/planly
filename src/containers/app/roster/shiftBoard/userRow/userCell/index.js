//@flow
import React, { PureComponent } from 'react'
import { minToTimeString } from 'helpers/roster'

import type { User, Position } from 'types/index'
import './styles.css'

type Props =  {
  user: User,
  position: ?Position,
  durationSum: number,
}

export default class  extends PureComponent{
  props: Props

  render(){
    const { position, user, durationSum } = this.props
    const color     = position && position.color
    const shortcut  = position && position.shortcut
    const posStyle = { color: color, borderColor: color }
    const currentWeeklyHours = user.currentWeeklyHours || ''


    return(
      <fb className="userCellMain">
        <fb className='posBox' style={posStyle}>{shortcut}</fb>
        <fb className='userName'>{user.name}</fb>
        <fb className='times'>
          {/* <fb className='overtime'> - 24 h</fb> */}
          <fb className='currentWeek'>{minToTimeString(durationSum) + ' / ' + currentWeeklyHours + ' h'}</fb>
        </fb>
      </fb>
    )
  }
}
