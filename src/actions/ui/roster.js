//@flow
import { getNextSmartWeek, getPrevSmartWeek } from 'helpers/index'
import type { ShiftCell, ThunkAction, GetState } from 'types/index'

export const changeCurrentBranch = (branchID: string) =>
  ({ type: 'SET_CURRENT_BRANCH', payload: branchID })

export const changeCurrentSmartWeek = (smartWeek: number) =>
  ({ type: 'SET_CURRENT_SMART_WEEK', payload: smartWeek })

export const changeCurrentTemplate = (templateID: string) =>
  ({ type: 'SET_CURRENT_TEMPLATE', payload: templateID })

export const enterTemplateMode: ThunkAction = () => (dispatch, getState: GetState) => {
  // at the same time we set currentTemplate to the default one ( equal to the branchID )
  const branchID = getState().ui.roster.currentBranch
  dispatch({ type: 'SET_CURRENT_TEMPLATE', payload: branchID })
  dispatch({ type: 'ENTER_TEMPLATE_MODE' })
}

export const leaveTemplateMode = () =>
  ({ type: 'LEAVE_TEMPLATE_MODE' })

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
