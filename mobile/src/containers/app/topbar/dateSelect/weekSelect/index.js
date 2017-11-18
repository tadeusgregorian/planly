//@flow
import React from 'react'
//import moment from 'moment'
import { getNextWeekID, getPrevWeekID } from 'helpers/roster'
import { smartWeekToMom } from 'helpers/index'
import './styles.css'

type Props = {
 currentWeekID: string,
 changeCurrentWeekID: (string)=>any,
}

export default (props: Props) => {
  const { currentWeekID } = props
  const mom = smartWeekToMom(props.currentWeekID)
  const week = mom.week()
  const fromDate = mom.format('DD.MM')
  const toDate   = mom.add(6 , 'days').format('DD.MM')
  const WeekStr    = 'KW ' + week
  const fromToStr  = fromDate + ' - ' + toDate

  const toPrev = () => {
    const prevWeek = getPrevWeekID(currentWeekID)
    props.changeCurrentWeekID(prevWeek)
  }

  const toNext = () => {
    const nextWeek = getNextWeekID(currentWeekID)
    props.changeCurrentWeekID(nextWeek)
  }

  return(
    <fb className="topbarWeekSelectMain">
      <fb className='prevBtn stepBtn icon icon-arrow-back-outline' onClick={toPrev}></fb>
      <fb className='weekDisplay'>
        <fb className='week'>{ WeekStr }</fb>
        <fb className='dates'>{ fromToStr }</fb>
      </fb>
      <fb className='nextBtn stepBtn icon icon-arrow-forward-outline' onClick={toNext}></fb>
    </fb>
  )
}
