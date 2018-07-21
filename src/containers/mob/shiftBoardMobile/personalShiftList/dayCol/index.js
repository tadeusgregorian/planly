//@flow
import React from 'react'
import moment from 'moment'
import type { ShiftExtAbs } from 'types/index'
import ShiftBox from '../../shiftBox'
import './styles.css'

type Props = {
  shifts: Array<ShiftExtAbs>,
  mom: moment,
  shiftClicked: (string)=>any,
  focusedShift: ?string,
}

export default (props: Props) => {
  const { mom, shifts, shiftClicked, focusedShift } = props

  return(
    <fb className="shiftBoardDayColMain">
      <fb className={'dayHead' + (!shifts.length ? ' isEmpty' : '')} >
        <fb className='weekDay'>{mom.format('dd')}</fb>
        <fb className='date'>{mom.format('D MMM').slice(0, -1)}</fb>
      </fb>
      <fb className='shiftsWrapper'>
      { shifts.map( s =>
        <ShiftBox
          key={s.id}
          shift={s}
          shiftClicked={shiftClicked}
          focused={focusedShift === s.id}
        />
      )}
    </fb>
    </fb>
  )
}
