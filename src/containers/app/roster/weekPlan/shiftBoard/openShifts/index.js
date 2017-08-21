//@flow
import React, { PureComponent } from 'react'
import { shiftToMinimalShift, generateGuid } from 'helpers/index'
import { weekDays } from 'constants/roster'

import DayColumn from './dayColumn'
import ShiftCell from '../shiftCell'
import './styles.css'

import type { Shifts, Note } from 'types/index'

type Props = {
  shifts: Shifts,
  highlightedCell: ?ShiftCell,
  shadowedCell: ?ShiftCell,
  notes: Array<Note>
}

export default (props: Props) => {

  const userIDs = weekDays.reduce((acc, val) => ({ ...acc, [val]: generateGuid() }), {})
  const { shifts, highlightedCell, notes, shadowedCell } = props

  return(
    <fb className="openShiftsMain">
      <fb className='label' ></fb>
        { weekDays.map(day =>
            <DayColumn
              day={day}
              user={userIDs[day]}
              shadowedUser={shadowedCell && shadowedCell.day === day && shadowedCell.user}
            />
          )
        }
    </fb>
  )
}
