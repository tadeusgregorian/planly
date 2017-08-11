import { getNextSmartWeek, getPrevSmartWeek } from 'helpers/index'

export const changeCurrentBranch = (branchID) => ({
  type: 'SET_CURRENT_BRANCH',
  payload: branchID
})

export const changeCurrentSmartWeek = (smartWeek) => ({
  type: 'SET_CURRENT_SMART_WEEK',
  payload: smartWeek
})

export const goToNextWeek = () => (dispatch, getState) => {
  const nextSW = getNextSmartWeek(getState().ui.roster.currentSmartWeek)
  dispatch({type: 'SET_CURRENT_SMART_WEEK', payload: nextSW})
}

export const goToLastWeek = () => (dispatch, getState) => {
  const prevSW = getPrevSmartWeek(getState().ui.roster.currentSmartWeek)
  dispatch({type: 'SET_CURRENT_SMART_WEEK', payload: prevSW})
}
