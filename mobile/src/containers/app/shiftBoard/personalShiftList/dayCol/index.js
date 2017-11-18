//@flow
import React from 'react'
import moment from 'moment'
import type { Shift } from 'types/index'
import ShiftBox from '../../shiftBox'
import './styles.css'

type Props = {
  shifts: Array<Shift>,
  mom: moment,
}

export default (props: Props) => {
  const { mom, shifts } = props

  return(
    <fb className="shiftBoardDayColMain">
      <fb className={'dayHead' + (!shifts.length ? ' isEmpty' : '')} >
        <fb className='weekDay'>{mom.format('dd')}</fb>
        <fb className='date'>{mom.format('D MMM')}</fb>
      </fb>
      { shifts.map( s =>
        <ShiftBox key={s.id} shift={s} />
      )}
    </fb>
  )
}
