//@flow

import { createFirebaseListener } from './firebaseHelpers'
import { getFBPath } from '../actionHelpers'
import type { GetState } from 'types/index'
import { db } from '../firebaseInit'


export const setAbsencesListener = (year: number) => (dispatch: Dispatch, getState: GetState) => {
  dispatch({ type: 'remove_absences' })
  const path        = getFBPath('absences')
  const queryRef    = db().ref(path).orderByChild('year').equalTo(year)

  createFirebaseListener(dispatch, getState, 'absences', path, queryRef)
}

export const setRequestedAbsencesListener = () => (dispatch: Dispatch, getState: GetState) => {
  const path        = getFBPath('vacationRequests')
  createFirebaseListener(dispatch, getState, 'vacationRequests', path)
}
