//@flow

import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'
import type { ThunkAction, GetState } from 'types/index'
import { db } from '../firebaseInit'

const getWeekAndBranch = (getState) => ({
  smartWeek:  getState().ui.roster.currentSmartWeek,
  branch:     getState().ui.roster.currentBranch
})

export const setInitialRosterListeners: ThunkAction = () => (dispatch, getState) => {
  setShiftWeekListener(dispatch, getState)
  setNotesListener(dispatch, getState)
  setShiftEditsListener(dispatch, getState)
  setTemplatesFlatListener(dispatch, getState)
  dispatch({type: 'remove_shiftWeek'})
}

export const setRosterListeners: ThunkAction = () => (dispatch, getState: GetState) => {
  const { templateMode } = getState().ui.roster
  if(templateMode) {
    setTemplateWeekListener(dispatch, getState)
  } else {
    setShiftWeekListener(dispatch, getState)
    setNotesListener(dispatch, getState)
  }
  dispatch({type: 'remove_shiftWeek'})
}

const setShiftWeekListener = (dispatch, getState: any) => {
  const { smartWeek, branch } = getWeekAndBranch(getState)
  const path        = getFirebasePath('shiftWeeks') + '/' + smartWeek
  const queryRef    = db().ref(path).orderByChild('branch').equalTo(branch)

  createFirebaseListener(dispatch, getState, 'shiftWeek', path, queryRef)
}

export const setTemplateWeekListener = (dispatch: Dispatch , getState: GetState) => {
  const templateID = getState().ui.roster.currentTemplate
  const path       = getFirebasePath('templateWeeks') + '/' + templateID
  createFirebaseListener(dispatch, getState, 'shiftWeek', path)
}

const setTemplatesFlatListener = (dispatch: Dispatch, getState: GetState) => {
  const path        = getFirebasePath('templatesFlat')
  createFirebaseListener(dispatch, getState, 'templatesFlat', path)
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
