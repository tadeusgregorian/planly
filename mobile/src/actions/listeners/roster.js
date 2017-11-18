//@flow

import { createFirebaseListener } from './firebaseHelpers'
import { getFBPath } from '../actionHelpers'
import type { ThunkAction, GetState } from 'types/index'
import { db } from '../firebaseInit'


export const setShiftWeekListener: ThunkAction = () => (dispatch, getState: GetState) => {
  dispatch({type: 'remove_shiftWeek'})

  const weekID    = getState().ui.roster.currentWeekID
  const day       = getState().ui.roster.currentDay
  const branch    = getState().ui.roster.currentBranch
  const planMode  = getState().ui.roster.planMode
  const userID    = getState().auth.currentUserID

  const path      = getFBPath('shiftWeeks', [weekID])
  const queryRef  = planMode === 'PERSONAL'
    ? db().ref(path).orderByChild('user').equalTo(userID)
    : db().ref(path).orderByChild('branchDay').equalTo(branch + day)

  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}

export const setWeeklyAbsencesListener: ThunkAction = () => (dispatch, getState: GetState) => {
  const weekID = getState().ui.roster.currentWeekID
  const path   = getFBPath('absencesWeekly', [weekID])
  createFirebaseListener(dispatch, getState, 'weekAbsences', path)

}
