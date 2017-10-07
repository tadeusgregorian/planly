//@flow
import React from 'react'
import moment from 'moment'
import './styles.css'

type Props = {
  mom: moment,
  width: number
}

export default (props: Props) => {

  const weekDays = ['Mo','Di','Mi','Do','Fr','Sa','So']
  const dayOfMonth     = props.mom.date()
  const dayOfWeek      = props.mom.weekday()
  const calendarWeek   = props.mom.week()
  const daysInMonth    = props.mom.daysInMonth()

  const toTight = (dayOfMonth === daysInMonth) || (dayOfMonth === 1 && dayOfWeek === 6)

  return(
    <fb className="absenceDayCellMain" style={{width: props.width}}>
      { (dayOfMonth === 1 || dayOfWeek === 0) &&
        <fb className='weekDisplay'> { !toTight && ('KW ' + calendarWeek) }</fb>
      }
      <fb className='weekDay'>{weekDays[dayOfWeek]}</fb>
      <fb className='monthDay'>{dayOfMonth}</fb>
    </fb>
  )
}
