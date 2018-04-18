//@flow
import React from 'react'
import { getNextWeekID, getPrevWeekID } from 'helpers/roster'
import { getNextWeekDay, getPrevWeekDay } from './localHelpers'
import { smartWeekToMom } from 'helpers/index'
import { weekDays } from 'constants/roster'
import type { Day } from 'types/index'
import './styles.css'

type Props = {
 currentWeekID: string,
 currentDay: Day,
 changeCurrentWeekID: (string)=>any,
 changeCurrentDay: (Day)=>any,
}

export default (props: Props) => {
  const { currentWeekID, currentDay } = props
  const mom = smartWeekToMom(currentWeekID)
  const week = mom.week()

  const momDay  = mom.add( weekDays.indexOf(currentDay) , 'days')
  const _date = momDay.format('dddd | DD. MMM');
  const dateStr = _date.substr(_date.length - 1) === '.' ? _date.slice(0, -1) : _date

  const toPrev = () => {
    currentDay === 'mo' && props.changeCurrentWeekID(getPrevWeekID(currentWeekID))
    props.changeCurrentDay(getPrevWeekDay(currentDay))
  }

  const toNext = () => {
    currentDay === 'su' && props.changeCurrentWeekID(getNextWeekID(currentWeekID))
    props.changeCurrentDay(getNextWeekDay(currentDay))
  }

  return(
    <fb className="topbarDaySelectMain">
      <fb className='prevBtn stepBtn icon icon-arrow_back' onClick={toPrev}></fb>
      <fb className='dayDisplay'>
        <fb className='date'>{ dateStr }</fb>
        <fb className='week'>{ 'KW ' + week }</fb>
      </fb>
      <fb className='nextBtn stepBtn icon icon-arrow_forward' onClick={toNext}></fb>
    </fb>
  )
}
