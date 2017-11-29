//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'

import { getDay, getOvertimeStatus } from './localHelpers'
import type { User, Shifts, CellRef, Store, ShiftRef, Position, Correction, ExtraHours, Absence } from 'types/index'
import getCurrentUser from 'selectors/currentUser'
import getInitialStartWeeks from 'selectors/initialStartWeeks'
import getCurrentWeekSums from 'selectors/weekSumsOfCurrentWeek'
import getCurrentOvertimes from 'selectors/overtimesOfCurrentWeek'
import getCurrentCorrections from 'selectors/correctionsOfCurrentWeek'
import getVisibleUsers from 'selectors/visibleUsersOfShiftBoard'
import getAbsentDaysOfUsers from 'selectors/absentDaysOfUsers'
import type { AbsentDaysOfUsers } from 'selectors/absentDaysOfUsers'
//import getUsersAdjustedToWeek from 'selectors/usersAdjustedToWeek'

import ShiftBoardHead from './shiftBoardHead'
import UserRow from './userRow'
import './styles.css'

type OwnProps = {
  shifts: Shifts,
  loading: boolean,
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
  absentDaysOfUsers: AbsentDaysOfUsers,
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
      absentDaysOfUsers,
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
      absentDays={absentDaysOfUsers[userID] || {}} // we need to OR here, cause openUser is causeing undefined here
      shadowedDay={isDragging ? getDay(cellUnderMouse, userID) : false} // could do && cause of random Flow issue
      highlightedDay={extraHoursMode ? getDay(cellUnderMouse, userID) : false} // could do && cause of random Flow issue
      focusedShiftRef={focusedShiftRef}
      cellUnderMouse={cellUnderMouse && cellUnderMouse.user === userID ? cellUnderMouse : null}
    />
  }

  render(){
    const {
      templateMode,
      loading,
      currentWeekID,
      currentUser,
      visibleUsers,
      //focusedShiftRef,
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
        <fb className={cn({loadingLayer: 1, visible: loading})}>loading...</fb>
        {/* <fb className={cn({darkOverlay:  1, visible: !!focusedShiftRef})}></fb> */}
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
  absentDaysOfUsers: getAbsentDaysOfUsers(state),
  focusedShiftRef: state.ui.roster.shiftBoard.focusedShiftRef,
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(ShiftBoard)
