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
  setRosterListeners()(dispatch, getState)
  setShiftEditsListener(dispatch, getState)
  setTemplatesFlatListener(dispatch, getState)
  setWeekSumsListener(dispatch, getState)
  setCorrectionsListener(dispatch, getState)
  dispatch({type: 'remove_shiftWeek'})
}

export const setRosterListeners: ThunkAction = () => (dispatch, getState: GetState) => {
  dispatch({type: 'remove_shiftWeek'})
  setExtraHoursListener(dispatch, getState)
  setShiftWeekListener(dispatch, getState)
  setWeekAbsenceListener(dispatch, getState)
  setDayNotesListener(dispatch, getState)
}

const setWeekAbsenceListener = (dispatch: Dispatch, getState: GetState) => {
  const weekID = getState().ui.roster.currentWeekID
  const path   = getFBPath('absencesWeekly', [weekID])
  createFirebaseListener(dispatch, getState, 'weekAbsences', path)
}

const setExtraHoursListener = (dispatch: Dispatch, getState: GetState) => {
  const { weekID, branch } = getWeekAndBranch(getState)
  const path      = getFBPath('extraHours', [weekID])
  const queryRef  = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'extraHours', path, queryRef)
}

const setShiftWeekListener = (dispatch, getState: any) => {
  const { weekID, branch } = getWeekAndBranch(getState)
  const path        = getFBPath('shiftWeeks', [weekID])
  const queryRef    = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}

const setWeekSumsListener = (dispatch: Dispatch, getState: GetState) => {
  const path        = getFBPath('weekSums')
  createFirebaseListener(dispatch, getState, 'weekSums', path)
}

const setCorrectionsListener = (dispatch: Dispatch, getState: GetState) => {
  const path        = getFBPath('corrections')
  createFirebaseListener(dispatch, getState, 'corrections', path)
}

const setTemplatesFlatListener = (dispatch: Dispatch, getState: GetState) => {
  const path        = getFBPath('templatesFlat')
  createFirebaseListener(dispatch, getState, 'templatesFlat', path)
}

const setShiftEditsListener = (dispatch, getState: any) => {
  const path = getFBPath('shiftEdits')
  createFirebaseListener(dispatch, getState, 'shiftEdits', path)
}

const setDayNotesListener = (dispatch: Dispatch, getState: GetState) => {
  const { weekID, branch }  = getWeekAndBranch(getState)
  const path                = getFBPath('dayNotes', [weekID])
  const queryRef            = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'dayNotes', path, queryRef)
}
