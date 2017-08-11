
import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'
import db from '../firebasedb'

export const setShiftWeekListener = () => (dispatch, getState) => {
  const smartWeek   = getState().ui.roster.currentSmartWeek
  const branch      = getState().ui.roster.currentBranch
  const path        = getFirebasePath('shiftWeeks') + '/' + smartWeek
  const queryRef    = db().ref(path).orderByChild('bid').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}
