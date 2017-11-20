//@flow
import React from 'react'
import type { PlanMode, Day } from 'types/index'
import WeekSelect from './weekSelect'
import DaySelect from './daySelect'
import './styles.css'

type Props = {
  planMode: PlanMode,
  changeCurrentWeekID: (string)=>any,
  changeCurrentDay: (Day)=>any,
  currentWeekID: string,
  currentDay: Day,
}

export default (props: Props) => {
  const {
    planMode,
    currentWeekID,
    currentDay,
    changeCurrentDay,
    changeCurrentWeekID } = props
  const teamMode = planMode === 'TEAM'
  const persMode = planMode === 'PERSONAL'



  return(
    <fb className="dateSelectMain">
      { persMode && <WeekSelect {...{ currentWeekID, changeCurrentWeekID }} /> }
      { teamMode && <DaySelect {...{
          currentWeekID,
          currentDay,
          changeCurrentWeekID,
          changeCurrentDay
        }} />
      }
    </fb>
  )
}
