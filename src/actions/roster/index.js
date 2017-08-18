// @flow

import type { ThunkAction } from 'types/index'
import { db } from '../firebaseInit'
import firebase from 'firebase'
import { getFirebasePath } from './../actionHelpers'
import type { PreDBShift } from 'types/index'

export const removeShiftWeek = () => ({type: 'remove_shiftWeek'})

const getShiftKey = (shift) => shift.branch + shift.user + shift.day

const extendShiftForDB = (sh: PreDBShift) => ({
  ...sh, branchDay: (sh.branch + sh.day), userDay: (sh.user + sh.day)
})

export const writeShiftToDB = (smartWeek: string, shift: PreDBShift) => {
  const dbShift = extendShiftForDB(shift)
  const key = getShiftKey(shift)
  db().ref(getFirebasePath('shiftWeeks')).child(smartWeek).child(key).set(dbShift)
}

export const writeShiftNoteToDB = (text: string): ThunkAction => (dispatch, getState: any) => {
  if(!getState().ui.roster.weekPlan.focusedCell) throw new Error('TADE: trying to write note to DB with focusedCell = null')
  const author            = getState().auth.currentUserID
  const { user, day }     = getState().ui.roster.weekPlan.focusedCell
  const smartWeek         = getState().ui.roster.currentSmartWeek
  const branch            = getState().ui.roster.currentBranch
  const timeStamp         = firebase.database.ServerValue.TIMESTAMP
  const type              = 'shiftNote' // can be shiftNote or dayNote
  const id                = branch + user + day + author
  db().ref(getFirebasePath('notes')).child(smartWeek).child(id).set({branch, user, day, author, timeStamp, type, text, id})
}
