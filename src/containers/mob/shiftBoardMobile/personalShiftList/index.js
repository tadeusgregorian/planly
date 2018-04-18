//@flow
import React from 'react'
import moment from 'moment'
import { weekIDToMoment } from 'helpers/roster'
import { weekDays } from 'constants/roster'
import DayCol from './dayCol'
import type { Shift } from 'types/index'
import './styles.css'

type Props = {
  shifts: Array<Shift>,
  weekID: string,
  focusedShift: ?string,
  shiftClicked: (id: string)=>any
}

export default (props: Props) => {
  const { shifts, weekID, focusedShift, shiftClicked } = props
  const mom = weekIDToMoment(weekID)

  return(
    <fb className="personalShiftListMain">
      { weekDays.map((day, i) =>
        <DayCol
          key={i}
          mom={moment(mom).add(i, 'days')}
          focusedShift={focusedShift}
          shifts={shifts.filter(s => s.day === day )}
          shiftClicked={shiftClicked}
        />
      )}
    </fb>
  )
}
