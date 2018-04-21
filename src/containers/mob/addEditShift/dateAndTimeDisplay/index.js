import React from 'react'
import {weekDays} from 'constants/roster';
import {weekIDToMoment} from 'helpers/roster';
import { Day } from 'types/index'

import './styles.css'

type Props = {
  branchName: string,
  shiftDay: Day,
  weekID: string
}

export default ({ branchName, shiftDay, weekID }: Props) => {
  const mom = weekIDToMoment(weekID).weekday(weekDays.indexOf(shiftDay))

  const _date = mom.format('ddd DD. MMM');
  const dateStr = _date.substr(_date.length - 1) === '.' ? _date.slice(0, -1) : _date

  return (
    <fb className="dateAndTimeDisplayMain_mob">
      <fb className="date">{dateStr}</fb>
      <fb className="sep">/</fb>
      <fb className="branch">{branchName}</fb>
    </fb>
  )
}
