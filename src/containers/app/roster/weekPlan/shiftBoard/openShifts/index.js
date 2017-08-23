//@flow
import React from 'react'
import { weekDays } from 'constants/roster'

import DayColumn from './dayColumn'
import ShiftCell from '../shiftCell'
import './styles.css'

import type { Shifts, Note } from 'types/index'

type Props = {
  shifts: Shifts,
  shadowedCell: ?ShiftCell,
  notes: Array<Note>
}

export default (props: Props) => {

  const { shifts, notes, shadowedCell } = props

  return(
    <fb className="openShiftsMain">
      <fb className='label' >
        <fb className='text'>Offene Schichten</fb>
        {/* <icon className='icon icon-high-five2' /> */}
      </fb>
        { weekDays.map(day =>
            <DayColumn
              shifts={shifts.filter(s => s.day === day)}
              notes={notes.filter(n => n.day === day)}
              key={day}
              day={day}
              shadowedUser={shadowedCell && shadowedCell.day === day && shadowedCell.user}
            />
          )
        }
    </fb>
  )
}
