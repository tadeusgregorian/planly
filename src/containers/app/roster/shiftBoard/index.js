//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import _ from 'lodash'

import { getShiftsOfUser, getShadowedDay, getDurationSum } from './localHelpers'
import type { User, Shifts, ShiftCell, Store, ShiftRef, Position, WeekAbsence, Correction } from 'types/index'
import getCurrentUser from 'selectors/currentUser'
import getCurrentWeekSums from 'selectors/weekSumsOfCurrentWeek'
import getCurrentOvertimes from 'selectors/overtimesOfCurrentWeek'
import getCurrentCorrections from 'selectors/correctionsOfCurrentWeek'
//import getUsersAdjustedToWeek from 'selectors/usersAdjustedToWeek'

import ShiftBoardHead from './shiftBoardHead'
import UserRow from './userRow'
import './styles.css'

type OwnProps = {
  shifts: Shifts,
  shadowedCell?: ?ShiftCell, // comes from HOC // there is a ? before the colon -> because flow thows error cause of injection of props
}

type ConProps = {
  branch: string,
  users: Array<User>,
  positions: Array<Position>,
  shifts: Shifts,
  currentWeekSums: {[userID: string]: number},
  currentOvertimes: {[userID: string]: number},
  currentCorrections: {[userID: string]: Correction},
  absences: Array<WeekAbsence>,
  currentUser: User,
  shadowedCell: ?ShiftCell,
  focusedShiftRef: ?ShiftRef,
  shiftUnderMouse: ?ShiftRef,
}

type Props = OwnProps & ConProps

class ShiftBoard extends PureComponent{
  props: Props

  renderUserRow = (userID: string, isOpen:boolean, user?: User) => {
    const {
      shadowedCell,
      shifts,
      currentUser,
      focusedShiftRef,
      shiftUnderMouse,
      positions,
      absences,
      currentWeekSums,
      currentOvertimes,
      currentCorrections } = this.props
    const shiftsOfUser = getShiftsOfUser(shifts, userID)

    return <UserRow
      key={userID}
      isOpen={isOpen}
      user={user}
      position={positions.find(p => user && p.id === user.position )}
      weekSum={currentWeekSums[userID]}
      overtime={currentOvertimes[userID]}
      correction={currentCorrections[userID]}
      userID={userID}
      currentUser={currentUser}
      shifts={shiftsOfUser}
      absences={absences.filter(a => a.user === userID)}
      shadowedDay={getShadowedDay(shadowedCell, userID)}
      focusedShiftRef={focusedShiftRef && focusedShiftRef.user === userID ? focusedShiftRef : null}
      shiftUnderMouse={shiftUnderMouse && shiftUnderMouse.user === userID ? shiftUnderMouse : null}
      highlightedDay={false}
    />
  }

  render(){
    const { users, branch } = this.props
    const usersOfBranch = users.filter(u => _.keys(u.branches).includes(branch))

    return(
      <fb id="shiftBoardMain">
        <ShiftBoardHead />
        <fb className='assignedShifts'>
          { this.renderUserRow('open', true) }
          { usersOfBranch.map(user => this.renderUserRow(user.id, false, user)) }
        </fb>
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  branch: state.ui.roster.currentBranch,
  users: state.core.users,
  positions: state.core.positions,
  shifts: state.roster.shiftWeek,
  currentWeekSums: getCurrentWeekSums(state),
  currentOvertimes: getCurrentOvertimes(state),
  currentCorrections: getCurrentCorrections(state),
  absences: state.roster.weekAbsences,
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  shiftUnderMouse: state.ui.roster.shiftBoard.shiftUnderMouse,
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(ShiftBoard)
