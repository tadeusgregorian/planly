//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import _ from 'lodash'

import { getShiftsOfUser, getNotesOfUser, getShadowedDay, getShiftEditsOfUser } from './localHelpers'
import type { User, Shifts, Note, ShiftEdit, ShiftCell, Store, ShiftRef } from 'types/index'
import getCurrentUser from 'selectors/currentUser'

import ShiftBoardHead from './shiftBoardHead'
import UserRow from './userRow'
import './styles.css'

type OwnProps = {
  shifts: Shifts,
  shadowedCell?: ?ShiftCell, // comes from HOC // there is a ? before the colon -> because flow thows error cause of injection of props
}

type ConProps = {
  smartWeek: number,
  branch: string,
  users: Array<User>,
  shifts: Shifts,
  shiftEdits: Array<ShiftEdit>,
  notes: Array<Note>,
  currentUser: User,
  shadowedCell: ?ShiftCell,
  focusedShiftRef: ?ShiftRef,
}

type Props = OwnProps & ConProps

class ShiftBoard extends PureComponent{
  props: Props

  render(){
    const { shiftEdits, smartWeek, branch, shadowedCell, notes, shifts, users, currentUser, focusedShiftRef } = this.props
    const usersOfBranch = users.filter(u => _.keys(u.branches).includes(branch))

    return(
      <fb id="shiftBoardMain">
          <ShiftBoardHead />
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
                focusedShiftRef={focusedShiftRef && focusedShiftRef.user === user.id ? focusedShiftRef : null}
                highlightedDay={false}
              />
            })}
          </fb>
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  branch: state.ui.roster.currentBranch,
  smartWeek: state.ui.roster.currentSmartWeek,
  users: state.core.users,
  notes: state.roster.notes,
  shifts: state.roster.shiftWeek,
  shiftEdits: state.roster.shiftEdits,
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(ShiftBoard)
