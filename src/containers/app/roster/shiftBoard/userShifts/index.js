//@flow
import React from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { getShiftsOfUser, getNotesOfUser, getShadowedDay, getShiftEditsOfUser } from '../localHelpers'
import getCurrentUser from 'selectors/currentUser'

import UserRow from './userRow'

import type { User, Shifts, Note, ShiftEdit, ShiftCell } from 'types/index'

import './styles.css'

type Props = {
  smartWeek: string,
  branch: string,
  users: Array<User>,
  shifts: Shifts,
  shiftEdits: Array<ShiftEdit>,
  notes: Array<Note>,
  currentUser: User,
  shadowedCell: ?ShiftCell
}

const UserShifts = (props: Props) => {

  const { shiftEdits, smartWeek, branch, shadowedCell, notes, shifts, users, currentUser } = props
  const usersOfBranch = users.filter(u => _.keys(u.branches).includes(branch))

  return(
    <fb className='assignedShifts'>
      { usersOfBranch.map(user => {
        return <UserRow
          key={user.id}
          user={user}
          currentUser={currentUser}
          shiftEdits={getShiftEditsOfUser(shiftEdits, user.id, smartWeek, branch)}
          shifts={getShiftsOfUser(shifts, user.id)}
          notes={getNotesOfUser(notes, user.id)}
          shadowedDay={getShadowedDay(shadowedCell, user.id)}
          highlightedDay={false}
        />
      })}
    </fb>
  )
}

const mapStateToProps = (state) => ({
  branch: state.ui.roster.currentBranch,
  smartWeek: state.ui.roster.currentSmartWeek,
  users: state.core.users,
  notes: state.roster.notes,
  shifts: state.roster.shiftWeek,
  shiftEdits: state.roster.shiftEdits,
  currentUser: getCurrentUser(state)
})

export default connect(mapStateToProps)(UserShifts)
