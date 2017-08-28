//@flow

import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'
import type { ThunkAction } from 'types/index'
import { db } from '../firebaseInit'

const getWeekAndBranch = (getState) => ({
  smartWeek:  getState().ui.roster.currentSmartWeek,
  branch:     getState().ui.roster.currentBranch
})

export const setInitialRosterListeners: ThunkAction = () => (dispatch, getState) => {
  setShiftWeekListener(dispatch, getState)
  setNotesListener(dispatch, getState)
  setShiftEditsListener(dispatch, getState)
  dispatch({type: 'remove_shiftWeek'})
}

export const setRosterListeners: ThunkAction = () => (dispatch, getState) => {
  setShiftWeekListener(dispatch, getState)
  setNotesListener(dispatch, getState)
  dispatch({type: 'remove_shiftWeek'})
}

const setShiftWeekListener = (dispatch, getState: any) => {
  const { smartWeek, branch } = getWeekAndBranch(getState)
  const path        = getFirebasePath('shiftWeeks') + '/' + smartWeek
  const queryRef    = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}

const setNotesListener = (dispatch, getState: any) => {
  const { smartWeek, branch } = getWeekAndBranch(getState)
  const path        = getFirebasePath('notes') + '/' + smartWeek
  const queryRef    = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'notes', path, queryRef)
}

const setShiftEditsListener = (dispatch, getState: any) => {
  const path = getFirebasePath('shiftEdits')
  createFirebaseListener(dispatch, getState, 'shiftEdits', path)
}
