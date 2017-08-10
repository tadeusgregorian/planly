import { getWeek, getYear, doubleD } from 'helpers/index'
import moment from 'moment'

export const changeCurrentBranch = (branchID) => ({
  type: 'SET_CURRENT_BRANCH',
  payload: branchID
})

export const changeCurrentSmartWeek = (smartWeek) => ({
  type: 'SET_CURRENT_SMART_WEEK',
  payload: smartWeek
})

export const goToNextWeek = () => (dispatch, getState) => {
  const smartWeek = getState().ui.roster.currentSmartWeek
  const week = getWeek(smartWeek)
  const year = getYear(smartWeek)
  const weeksInYear = moment().year(year).weeksInYear()
  const newSW = weeksInYear === week ? ((year + 1) + '01') : year + doubleD(week + 1)
  dispatch({type: 'SET_CURRENT_SMART_WEEK', payload: newSW})
}

export const goToLastWeek = () => (dispatch, getState) => {
  const smartWeek = getState().ui.roster.currentSmartWeek
  const week = getWeek(smartWeek)
  const year = getYear(smartWeek)
  const weeksInLastYear = moment().year(year - 1).weeksInYear()
  const newSW = week === 0 ? (year - 1) + '' + weeksInLastYear : year + doubleD(week - 1)
  dispatch({type: 'SET_CURRENT_SMART_WEEK', payload: newSW})
}
