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
      <PlanModeSelector  {...{ planMode, setPlanMode }} />
      { teamMode &&
        <fb className='branch' onClick={openBranchPick} >
          <fb className="icon icon-arrow_drop_down"></fb>
          {branchName}
        </fb>
      }
      { persMode && <fb className='myPlan'> Mein Wochenplan </fb> }
      <fb className='js-menu-show openSideNavBtn icon icon-dehaze' onClick={openOptionsBar}></fb>
    </fb>
  )
}
