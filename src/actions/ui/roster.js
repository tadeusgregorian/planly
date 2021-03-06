//@flow
import { getNextWeekID, getPrevWeekID, generateGuid } from 'helpers/index'
import type { ThunkAction, GetState, ShiftRef, CellRef, Day, PlanMode } from 'types/index'
import { getLastTempIDOfBranch } from './localHelpers'

export const changeCurrentBranch: ThunkAction = (branchID: string) => (dispatch, getState: GetState) => {
  const tempMode = !!getState().ui.roster.templateMode
  const tempID   = getLastTempIDOfBranch(getState, branchID)

   tempMode && dispatch({ type: 'SET_CURRENT_WEEK_ID', payload: tempID })
  !tempMode && localStorage.setItem('currentBranch', branchID )

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

export const enterTemplateMode: ThunkAction = () => (dispatch, getState: GetState) => {
  const currentBranch = getState().ui.roster.currentBranch
  dispatch({ type: 'ENTER_TEMPLATE_MODE', payload: getLastTempIDOfBranch(getState, currentBranch) })
}

export const leaveTemplateMode = () =>
  ({ type: 'LEAVE_TEMPLATE_MODE' })

export const goToNextWeek: ThunkAction = () => (dispatch, getState) => {
  const nextSW = getNextWeekID(getState().ui.roster.currentWeekID)
  dispatch({type: 'SET_CURRENT_WEEK_ID', payload: nextSW})
}

export const goToLastWeek: ThunkAction = () => (dispatch, getState) => {
  const prevSW = getPrevWeekID(getState().ui.roster.currentWeekID)
  dispatch({type: 'SET_CURRENT_WEEK_ID', payload: prevSW})
}

export const createShift = (shiftCell: CellRef) => {
  const { user, day } = shiftCell
  const id = generateGuid()
  const focusedShiftRef: ShiftRef = { id, user, day, inCreation: true }
  return { type: 'FOCUS_SHIFT', payload: focusedShiftRef }
}

export const setShiftUnderMouse = (shiftRef: ShiftRef | null) => (
  { type: 'SET_SHIFT_UNDER_MOUSE', payload: shiftRef })

export const focusShift = (shiftRef: ShiftRef) => (
  { type: 'FOCUS_SHIFT', payload: shiftRef })

export const unfocusShift = () =>
  ({ type: 'UNFOCUS_SHIFT' })

export const toggleOptions = () =>
  ({ type: 'TOGGLE_POPOVER_OPTIONS' })

export const enterExtraHoursMode = () =>
  ({ type: 'ENTER_EXTRA_HOURS_MODE' })

export const leaveExtraHoursMode = () =>
  ({ type: 'LEAVE_EXTRA_HOURS_MODE' })

export const hideNonWorkers = (hide: boolean) =>
  ({ type: 'HIDE_NON_WORKES', payload: hide })

export const toggleShiftBoardTimeDetails: ThunkAction = () => (dispatch, getState) => {
  const TDVisible = getState().ui.roster.shiftBoard.timeDetailsVisible
  localStorage.setItem('timeDetailsVisible', TDVisible ? '' : 'true')
  console.log(TDVisible);
  dispatch({ type: ( TDVisible ? 'HIDE_ROSTER_TIME_DETAILS' : 'SHOW_ROSTER_TIME_DETAILS') })
}
