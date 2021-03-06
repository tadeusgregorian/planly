//@flow
import React from 'react'
import type { Shift } from 'types/index'
import ShiftBox from '../shiftBox'
import './styles.css'

type Props = {
  shifts: Array<Shift>,
  isLoading: boolean
}

export default (props: Props) => {
  const { shifts, isLoading } = props

  return(
    <fb className="teamShiftListMain">
      { !shifts.length && !isLoading &&
        <fb className='noShifts'>
          <fb className='icon icon-event_busy'></fb>
          <fb className='text'>Keine Schichten in dieser Kalenderwoche.</fb>
        </fb>
      }
      { shifts.map(s =>
        <ShiftBox key={s.id} shift={s} />
      )}
    </fb>
  )
}
