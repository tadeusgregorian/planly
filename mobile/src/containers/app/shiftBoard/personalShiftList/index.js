//@flow
import React from 'react'
import moment from 'moment'
import { weekIDToMoment } from 'helpers/roster'
import { weekDays } from 'helpers/roster'
import DayCol from './dayCol'
import type { Shift } from 'types/index'
import './styles.css'

type Props = {
  shifts: Array<Shift>,
  weekID: string,
}

export default (props: Props) => {
  const { shifts, weekID } = props
  const mom = weekIDToMoment(weekID)

  return(
    <fb className="personalShiftListMain">
      { weekDays.map((day, i) =>
        <DayCol
          key={i}
          mom={moment(mom).add(i, 'days')}
          shifts={shifts.filter(s => s.day === day )}
        />
      )}
    </fb>
  )
}
