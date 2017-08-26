//@flow
import React from 'react'
import { connect } from 'react-redux'
import { weekDays } from 'constants/roster'

import getCurrentUser from 'selectors/currentUser'

import DayColumn from './dayColumn'
import ShiftCell from '../shiftCell'
import './styles.css'

import type { Shifts, Note, Position, User } from 'types/index'

type Props = {
  shifts: Shifts,
  positions: Array<Position>,
  shadowedCell: ?ShiftCell,
  notes: Array<Note>,
  currentUser: User
}

const OpenShifts = (props: Props) => {

  const { shifts, notes, shadowedCell, positions, currentUser } = props

  return(
    <fb className="openShiftsMain">
      <fb className='label' >
        <fb className='text'>Offene Schichten</fb>
        {/* <icon className='icon icon-high-five2' /> */}
      </fb>
        { weekDays.map(day =>
            <DayColumn
              currentUser={currentUser}
              shifts={shifts.filter(s => s.day === day)}
              notes={notes.filter(n => n.day === day)}
              positions={positions}
              key={day}
              day={day}
              shadowedUser={shadowedCell && shadowedCell.day === day && shadowedCell.user}
            />
          )
        }
    </fb>
  )
}

const mapStateToProps = (state) => ({
  shifts: state.roster.shiftWeek.filter(s => s.isOpen),
  notes: state.roster.notes,
  currentUser: getCurrentUser(state),
  positions: state.core.positions,
})

export default connect(mapStateToProps)(OpenShifts)
