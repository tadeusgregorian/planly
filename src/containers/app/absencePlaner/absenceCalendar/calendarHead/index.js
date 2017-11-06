//@flow
import React, { PureComponent } from 'react'
import { dayWidth } from 'constants/absence'
import moment from 'moment'
import type { BundeslandCode } from 'types/index'
import DayCell from './dayCell'
import './styles.css'

type Props = {
  month: number,
  year: number,
  adminMode: boolean,
  bundesland: BundeslandCode,
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

  getTypeTerm = () => {
    switch (this.props.type){
      case 'vac':   return 'Urlaub'
      case 'ill':   return 'Krankheit'
      case 'extra': return 'Sosntiges'
      case 'all':   return 'Abwesenheit'
      default: return ''
    }
  }

  render(){
    const { year, month, bundesland } = this.props
    return(
      <fb className="absenceCalendarHeadMain">
        <fb className='usersHead'>
          <fb className='type'>{this.getTypeTerm()}</fb>
          <fb className='year'>{year}</fb>
        </fb>
        <fb className='monthHead'>
          { this.getDaysArray().map(d => {
            const mom = moment().year(year).month(month).date(d)
            const isHoliday = mom.isHoliday(bundesland)
            return(
              <DayCell
                key={d}
                width={dayWidth}
                isHolliday={isHoliday}
                mom={mom} />
              )
          })}
        </fb>
      </fb>
    )
  }
}
