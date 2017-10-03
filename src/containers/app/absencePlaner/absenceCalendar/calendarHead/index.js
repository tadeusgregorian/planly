//@flow
import React, { PureComponent } from 'react'
import { dayWidth } from 'constants/absence'
import moment from 'moment'

import DayCell from './dayCell'
import './styles.css'

type Props = {
  month: number,
  year: number
}

export default class CalendarHead extends PureComponent{
  prosp: Props

  getDaysArray = () => {
    const { year, month } = this.props
    const length = moment().year(year).month(month).daysInMonth()
    let monthArr = []
    for(let i = 1; i <= length; i++){ monthArr.push(i) }
    return monthArr
  }

  render(){
    const { year, month } = this.props
    return(
      <fb className="absenceCalendarHeadMain">
        <fb className='usersHead'></fb>
        <fb className='monthHead'>
          { this.getDaysArray().map(d =>
            <DayCell
              key={d}
              width={dayWidth}
              mom={moment().year(year).month(month).date(d)} />
          )}
        </fb>
      </fb>
    )
  }
}
