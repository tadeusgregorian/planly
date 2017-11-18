//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { setPlanMode, changeCurrentWeekID, changeCurrentDay } from 'actions/ui/roster'
import { openSideNav } from 'actions/ui/index'
import DateSelect from './dateSelect'
import Navigation from './navigation'

import type { Store, PlanMode, SideNav, Branch, Day } from 'types/index'
import './styles.css'

type Props = {
  planMode: PlanMode,
  branches: Array<Branch>,
  currentBranch: string,
  currentWeekID: string,
  currentDay: Day,
  setPlanMode: (PlanMode)=>any,
  changeCurrentWeekID: (string)=>any,
  changeCurrentDay: (Day)=>any,
  openSideNav: (SideNav)=>any,
}

class Topbar extends PureComponent {

  render(){
    const {
      planMode,
      setPlanMode,
      openSideNav,
      branches,
      currentBranch,
      currentWeekID,
      changeCurrentWeekID,
      changeCurrentDay,
      currentDay } = this.props

    const curBranch: Branch = (branches.find(b => b.id === currentBranch) :any)
    const branchName = curBranch.name
    const openBranchPick = () => openSideNav('BRANCH_PICK')
    const openOptionsBar = () => openSideNav('OPTIONS')

    return(
      <fb id="topbarMain">
        <Navigation {...{ planMode, setPlanMode, openBranchPick, openOptionsBar, branchName }} />
        <DateSelect {...{ planMode, currentWeekID, currentDay, changeCurrentWeekID, changeCurrentDay }} />
      </fb>
    )
  }
}

const actionCreators = {
  setPlanMode,
  openSideNav,
  changeCurrentWeekID,
  changeCurrentDay,
}

const mapStateToProps = (state: Store) => ({
  planMode: state.ui.roster.planMode,
  branches: state.core.branches,
  currentBranch: state.ui.roster.currentBranch,
  currentDay: state.ui.roster.currentDay,
  currentWeekID: state.ui.roster.currentWeekID,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(Topbar)
