//@flow
import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'
import { weekDays } from 'constants/roster'

import getCurrentUser from 'selectors/currentUser'

import DayColumn from './dayColumn'
import './styles.css'

import type { Shifts, Note, Position, User } from 'types/index'

type OwnProps = {
  shifts: Shifts,
}

type ConProps = {
  positions: Array<Position>,
  notes: Array<Note>,
  currentUser: User
}

type Props = OwnProps & ConProps

const OpenShifts = (props: Props) => {

  const { shifts, notes, positions, currentUser } = props
  const openShifts = shifts.filter(s => s.isOpen)

  return(
    <fb className="openShiftsMain">
      <fb className='label' >
        <fb className='text'>Offene Schichten</fb>
      </fb>
        { weekDays.map(day =>
            <DayColumn
              currentUser={currentUser}
              shifts={openShifts.filter(s => s.day === day)}
              notes={notes.filter(n => n.day === day)}
              positions={positions}
              key={day}
              day={day}
            />
          )
        }
    </fb>
  )
}

const mapStateToProps = (state: Store) => ({
  notes: state.roster.notes,
  currentUser: getCurrentUser(state),
  positions: state.core.positions,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(OpenShifts)
