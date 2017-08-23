//@flow

import React from 'react'
import { shiftCellWidth } from 'constants/roster'
import type { Notes, Shifts } from 'types/index'
import { shiftToMinimalShift } from 'helpers/index'
import ShiftCell from '../../shiftCell'
import './styles.css'

type Props = {
  day: string,
  shifts: Shifts,
  notes: Notes,
}

export default (props: Props) => {

  // const openShiftInputCell = {
  //   flex: '1 1'
  // }

  return(
    <fb className="openShiftsDayColumnMain" style={{width: shiftCellWidth}}>
      { props.shifts.map(shift => {
          const minimalShift  = shift && shiftToMinimalShift(shift)
          return <ShiftCell
              key={shift.user}
              user={shift.user}
              shift={minimalShift}
              day={props.day}
              shiftType='openshift'
            />
        })
      }
      <ShiftCell
        user={'open'}
        day={props.day}
        shiftType='openshift'
        cssClass='openShiftInputCell'
      />
    </fb>
  )
}
