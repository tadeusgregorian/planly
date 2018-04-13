//@fow
import React from 'react'
import cn from 'classnames'
import { minToTimeString } from 'helpers/roster'

import './styles.css'

export default ({ weekSum, weeklyMins }) => {

  const sollTime = Math.round((weeklyMins / 60) * 100) / 100
  const negative = weekSum < weeklyMins
  const positive = weekSum > weeklyMins

  return (
    <fb className='times'>
      <fb className='currentWeek'>
        <fb className={cn({ istTime: 1, negative, positive })}  >{minToTimeString(weekSum, false)}</fb>
        <fb className='sollTime'>{' / ' + sollTime + ' h'}</fb>
      </fb>
    </fb>
  )
}
