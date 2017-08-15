
import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'
import { db } from '../firebaseInit'

export const setShiftWeekListener = () => (dispatch, getState) => {
  const smartWeek   = getState().ui.roster.currentSmartWeek
  const branch      = getState().ui.roster.currentBranch
  const path        = getFirebasePath('shiftWeeks') + '/' + smartWeek
  const queryRef    = db().ref(path).orderByChild('branch').equalTo(branch)

  dispatch({type: 'remove_shiftWeek'})
  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}
