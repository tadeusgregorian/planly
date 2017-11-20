//@flow
import React from 'react'
import type { Shift } from 'types/index'
import ShiftBox from '../shiftBox'
import './styles.css'

type Props = {
  shifts: Array<Shift>
}

export default (props: Props) => {
  const { shifts } = props

  return(
    <fb className="teamShiftListMain">
      { shifts.map(s =>
        <ShiftBox key={s.id} shift={s} />
      )}
    </fb>
  )
}
