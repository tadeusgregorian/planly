//@flow

import { createFirebaseListener } from './firebaseHelpers'
import { getFBPath } from '../actionHelpers'
import type { ThunkAction, GetState } from 'types/index'
import { db } from '../firebaseInit'

const getWeekAndBranch = (getState) => ({
  weekID:  getState().ui.roster.currentWeekID,
  branch:  getState().ui.roster.currentBranch
})

export const setInitialRosterListeners: ThunkAction = () => (dispatch, getState) => {
  setShiftWeekListener(dispatch, getState)
  setShiftEditsListener(dispatch, getState)
  setTemplatesFlatListener(dispatch, getState)
  setWeekAbsenceListener(dispatch, getState)
  dispatch({type: 'remove_shiftWeek'})
}

export const setRosterListeners: ThunkAction = () => (dispatch, getState: GetState) => {
  setShiftWeekListener(dispatch, getState)
  setWeekAbsenceListener(dispatch, getState)
  dispatch({type: 'remove_shiftWeek'})
}

const setWeekAbsenceListener = (dispatch: Dispatch, getState: GetState) => {
  const weekID = getState().ui.roster.currentWeekID
  const path   = getFBPath('absencesWeekly', [weekID])
  createFirebaseListener(dispatch, getState, 'weekAbsences', path)
}

const setShiftWeekListener = (dispatch, getState: any) => {
  const { weekID, branch } = getWeekAndBranch(getState)
  const path        = getFBPath('shiftWeeks') + '/' + weekID
  const queryRef    = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}

const setTemplatesFlatListener = (dispatch: Dispatch, getState: GetState) => {
  const path        = getFBPath('templatesFlat')
  createFirebaseListener(dispatch, getState, 'templatesFlat', path)
}

const setShiftEditsListener = (dispatch, getState: any) => {
  const path = getFBPath('shiftEdits')
  createFirebaseListener(dispatch, getState, 'shiftEdits', path)
}
