//@flow
import { getNextWeekID, getPrevWeekID, generateGuid } from 'helpers/index'
import type { ThunkAction, GetState, ShiftRef, ShiftCell } from 'types/index'

export const changeCurrentBranch = (branchID: string) =>
  ({ type: 'SET_CURRENT_BRANCH', payload: branchID })

export const changeCurrentWeekID = (weekID: string) =>
  ({ type: 'SET_CURRENT_WEEK_ID', payload: weekID })

export const enterTemplateMode: ThunkAction = () => (dispatch, getState: GetState) => {
  // hacky!: at the same time this sets currentWeekID to the default one ( equal to the branchID )
  const branchID = getState().ui.roster.currentBranch
  dispatch({ type: 'ENTER_TEMPLATE_MODE', payload: branchID })
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

export const createShift = (shiftCell: ShiftCell) => {
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
