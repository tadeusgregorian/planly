//@flow
import { getNextWeekID, getPrevWeekID } from 'helpers/roster'
import type { ThunkAction, GetState, Day, PlanMode } from 'types/index'

export const changeCurrentBranch: ThunkAction = (branchID: string) => (dispatch, getState: GetState) => {
  localStorage.setItem('currentBranch', branchID )
  dispatch({ type: 'SET_CURRENT_BRANCH', payload: branchID })
}

export const changeCurrentWeekID = (weekID: string) =>
  ({ type: 'SET_CURRENT_WEEK_ID', payload: weekID })

export const changeCurrentDay = (day: Day) => {
  console.log('changeDay: ', day);
  return ({ type: 'SET_CURRENT_DAY', payload: day })
}

export const setPlanMode = (mode: PlanMode) =>
  ({ type: 'SET_PLAN_MODE', payload: mode })

export const goToNextWeek: ThunkAction = () => (dispatch, getState) => {
  const nextSW = getNextWeekID(getState().ui.roster.currentWeekID)
  dispatch({type: 'SET_CURRENT_WEEK_ID', payload: nextSW})
}

export const goToLastWeek: ThunkAction = () => (dispatch, getState) => {
  const prevSW = getPrevWeekID(getState().ui.roster.currentWeekID)
  dispatch({type: 'SET_CURRENT_WEEK_ID', payload: prevSW})
}
