//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { getDay, getOvertimeStatus } from './localHelpers'
import type { User, Shifts, CellRef, Store, ShiftRef, Position, WeekAbsence, Correction, ExtraHours } from 'types/index'
import getCurrentUser from 'selectors/currentUser'
import getInitialStartWeeks from 'selectors/initialStartWeeks'
import getCurrentWeekSums from 'selectors/weekSumsOfCurrentWeek'
import getCurrentOvertimes from 'selectors/overtimesOfCurrentWeek'
import getCurrentCorrections from 'selectors/correctionsOfCurrentWeek'
import getVisibleUsers from 'selectors/visibleUsersOfShiftBoard'
//import getUsersAdjustedToWeek from 'selectors/usersAdjustedToWeek'

import ShiftBoardHead from './shiftBoardHead'
import UserRow from './userRow'
import './styles.css'

type OwnProps = {
  shifts: Shifts,
  templateMode: boolean,
  isDragging?: ?boolean,    // comes from HOC // there is a ? before the colon -> because flow thows error cause of injection of props
  cellUnderMouse?: ?CellRef,  // comes from HOC // there is a ? before the colon -> because flow thows error cause of injection of props
}

type ConProps = {
  branch: string,
  users: Array<User>,
  positions: Array<Position>,
  shifts: Shifts,
  extraHours: Array<ExtraHours>,
  extraHoursMode: boolean,
  timeDetailsVisible: boolean,
  currentWeekID: string,
  currentWeekSums: {[userID: string]: number},
  currentOvertimes: {[userID: string]: number},
  initialStartWeeks: {[userID: string]: string},
  currentCorrections: {[userID: string]: Correction},
  visibleUsers: Array<User>,
  absences: Array<WeekAbsence>,
  currentUser: User,
  focusedShiftRef: ?ShiftRef,
}

type Props = OwnProps & ConProps

class ShiftBoard extends PureComponent{
  props: Props

  renderUserRow = (userID: string, isOpen:boolean, user?: User) => {
    const {
      isDragging,
      shifts,
      extraHours,
      extraHoursMode,
      timeDetailsVisible,
      templateMode,
      currentWeekID,
      initialStartWeeks,
      currentUser,
      focusedShiftRef,
      cellUnderMouse,
      positions,
      absences,
      currentWeekSums,
      currentOvertimes,
      currentCorrections } = this.props

    return <UserRow
      key={userID}
      isOpen={isOpen}
      user={user}
      position={positions.find(p => user && p.id === user.position )}
      weekSum={currentWeekSums[userID]}
      overtime={currentOvertimes[userID]}
      correction={currentCorrections[userID]}
      overtimeStatus={getOvertimeStatus(currentWeekID, initialStartWeeks[userID])}
      templateMode={templateMode}
      timeDetailsVisible={timeDetailsVisible}
      userID={userID}
      currentUser={currentUser}
      shifts={shifts.filter(s => s.user === userID)}
      extraHours={extraHours.filter(e => e.user === userID)}
      absences={absences.filter(a => a.user === userID)}
      shadowedDay={isDragging ? getDay(cellUnderMouse, userID) : false} // could do && cause of random Flow issue
      highlightedDay={extraHoursMode ? getDay(cellUnderMouse, userID) : false} // could do && cause of random Flow issue
      focusedShiftRef={focusedShiftRef}
      cellUnderMouse={cellUnderMouse && cellUnderMouse.user === userID ? cellUnderMouse : null}
    />
  }

  render(){
    const {
      templateMode,
      currentWeekID,
      currentUser,
      visibleUsers,
      timeDetailsVisible } = this.props

    const adminMode = !!currentUser.isAdmin

    return(
      <fb id="shiftBoardMain">
        <ShiftBoardHead
          templateMode={templateMode}
          timeDetailsVisible={timeDetailsVisible}
          weekID={currentWeekID}
          adminMode={adminMode}
        />
        <fb className='assignedShifts'>
          { this.renderUserRow('open', true) }
          { visibleUsers.map(user => this.renderUserRow(user.id, false, user)) }
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
  extraHours: state.roster.extraHours,
  extraHoursMode: state.ui.roster.extraHoursMode,
  timeDetailsVisible: state.ui.roster.shiftBoard.timeDetailsVisible,
  currentWeekID: state.ui.roster.currentWeekID,
  initialStartWeeks: getInitialStartWeeks(state),
  currentWeekSums: getCurrentWeekSums(state),
  currentOvertimes: getCurrentOvertimes(state),
  currentCorrections: getCurrentCorrections(state),
  visibleUsers: getVisibleUsers(state),
  absences: state.roster.weekAbsences,
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(ShiftBoard)
