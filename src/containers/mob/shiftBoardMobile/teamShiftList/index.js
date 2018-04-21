//@flow
import React from 'react'
import type { Shift } from 'types/index'
import ShiftBox from '../shiftBox'
import './styles.css'

type Props = {
  shifts: Array<Shift>,
  isLoading: boolean,
  focusedShift: ?string,
  isAdmin: boolean,
  shiftClicked: (id: string)=>any,
  addShiftClicked: ()=>any,
}

export default (props: Props) => {
  const { shifts, isLoading, focusedShift, shiftClicked, addShiftClicked, isAdmin } = props

  return(
    <fb className="teamShiftListMain">
      { !shifts.length && !isLoading &&
        <fb className='noShifts'>
          <fb className='icon icon-event_busy'></fb>
          <fb className='text'>Keine Schichten in dieser Kalenderwoche.</fb>
        </fb>
      }
      { shifts.map(s =>
        <ShiftBox
          key={s.id}
          shift={s}
          focused={focusedShift === s.id}
          shiftClicked={shiftClicked}
        />
      ).concat(
        isAdmin
          ? (
              <fb key='new' className="addShiftBtn" onClick={addShiftClicked}>
                <fb className="icon icon-add_box"></fb>
                <fb>Schicht Erstellen</fb>
              </fb>
            )
          : null
      )
    }
    </fb>
  )
}
