//@flow
import React from 'react'
import type { PlanMode } from 'types/index'
import './styles.css'

type Props = {
  planMode: PlanMode,
  setPlanMode: (PlanMode)=>any,
}

export default (props: Props) => {

  const setPersonal = () => props.setPlanMode('PERSONAL')
  const setTeam     = () => props.setPlanMode('TEAM')

  const persClass = props.planMode === 'PERSONAL' ? ' active' : ''
  const teamClass = props.planMode === 'TEAM'     ? ' active' : ''

  return(
    <fb className="planModeSelectorMain">
      <fb className={'icon icon-user sel personal' + persClass} onClick={setPersonal}></fb>
      <fb className={'icon icon-group sel team' + teamClass} onClick={setTeam}></fb>
    </fb>
  )
}
