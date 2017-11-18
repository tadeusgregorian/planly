//@flow
import React from 'react'
import PlanModeSelector from './planModeSelector'
import type { PlanMode } from 'types/index'
import './styles.css'

type Props = {
  planMode: PlanMode,
  branchName: string,
  setPlanMode: (PlanMode)=>any,
  openBranchPick: ()=>any,
  openOptionsBar: ()=>any,
}

export default (props: Props) => {
  const { planMode, setPlanMode, openBranchPick, openOptionsBar, branchName } = props
  const teamMode = planMode === 'TEAM'
  const persMode = planMode === 'PERSONAL'

  return(
    <fb className="navigationMain">
      <fb className='js-menu-show openSideNavBtn icon icon-th-menu' onClick={openOptionsBar}></fb>
      <PlanModeSelector  {...{ planMode, setPlanMode }} />
      { teamMode && <fb className='branch' onClick={openBranchPick} >{branchName}</fb> }
      { persMode && <fb className='myPlan'> Mein Dienstplan </fb> }
    </fb>
  )
}
