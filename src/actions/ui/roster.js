//@flow
import { getNextSmartWeek, getPrevSmartWeek } from 'helpers/index'
import type { ShiftCell, ThunkAction } from 'types/index'

export const changeCurrentBranch = (branchID: string) =>
  ({ type: 'SET_CURRENT_BRANCH', payload: branchID })

export const changeCurrentSmartWeek = (smartWeek: number) =>
  ({ type: 'SET_CURRENT_SMART_WEEK', payload: smartWeek })

export const goToNextWeek: ThunkAction = () => (dispatch, getState) => {
  const nextSW = getNextSmartWeek(getState().ui.roster.currentSmartWeek)
  dispatch({type: 'SET_CURRENT_SMART_WEEK', payload: nextSW})
}

export const goToLastWeek: ThunkAction = () => (dispatch, getState) => {
  const prevSW = getPrevSmartWeek(getState().ui.roster.currentSmartWeek)
  dispatch({type: 'SET_CURRENT_SMART_WEEK', payload: prevSW})
}

export const focusShiftCell = (cell: ShiftCell) => (
  { type: 'FOCUS_SHIFT_CELL', payload: cell })

export const unfocusShiftCell = () =>
  ({ type: 'UNFOCUS_SHIFT_CELL' })

export const toggleOptions = () =>
  ({ type: 'TOGGLE_POPOVER_OPTIONS' })
