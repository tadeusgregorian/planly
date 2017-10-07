//@flow
import React from 'react'
//import moment from 'moment'
import { smartToMom } from 'helpers/index'
import './styles.css'

type Props = {
  startDate: ?number, // requested Absences always have a start and end date
  endDate: ?number  // requested Absences always have a start and end date -> optional just to silence flow
}

export default (props: Props) => {
  const { startDate , endDate } = props

  const startString = startDate && smartToMom(startDate).format('DD.MM.YYYY')
  const endString = endDate && smartToMom(endDate).format('DD.MM.YYYY')

  return(
    <fb className="displayVacationRangeMain">
      <fb>Uralub Beantragt für den Zeitraum:</fb>
      <fb className='dateWrapper'>
        <fb className='vacDate'>{startString}</fb>
        <fb className='seperator'>-</fb>
        <fb className='vacDate'>{endString}</fb>
      </fb>
    </fb>
  )
}
