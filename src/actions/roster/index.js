// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { toDBShift, getShiftUpdate } from './localHelpers'
import type { Shift, ShiftEdit, ThunkAction, GetState, MinimalShift } from 'types/index'

export const removeShiftWeek = () => ({type: 'remove_shiftWeek'})

export const saveShiftToDB:ThunkAction = (shift: Shift, deleteIt = false) => (disp, getState: GetState) => {
  const branch        = getState().ui.roster.currentBranch
  const weekID     = getState().ui.roster.currentWeekID
  const tempID        = getState().ui.roster.currentTemplate
  const templateMode  = getState().ui.roster.templateMode
  templateMode
    ? db().ref().update( getShiftUpdate(shift, tempID, branch, deleteIt, true) )
    : db().ref().update( getShiftUpdate(shift, weekID, branch, deleteIt) )
}

export const saveShiftEditToDB:ThunkAction = (shiftID: string, shiftEdit: MinimalShift ) => (disp, getState) => {
  const weekID = getState().ui.roster.currentWeekID
  const branch    = getState().ui.roster.currentBranch
  const update1   = {[ getFBPath('shiftEdits', [shiftID]) ]: { shiftID, branch, weekID }}
  const update2   = {[ getFBPath('shiftWeeks', [weekID, shiftID, 'edit']) ]: shiftEdit }
  db().ref().update({ ...update1, ...update2 })
}

export const acceptEdit = (shiftEdit: ShiftEdit) => {

}

export const rejectEdit = (shiftEdit: ShiftEdit) => {

}

export const assignOpenShift:ThunkAction = (openShift: Shift, user: string) => (disp, getState) => {
  const weekID = getState().ui.roster.currentWeekID
  const branch    = getState().ui.roster.currentBranch
  const { s, e, b, day, id } = openShift
  const shift: Shift = { s, e, b, day, user, id }
  const update1 = getShiftUpdate(openShift, weekID, branch, true) // deleting openShift
  const update2 = getShiftUpdate(shift, weekID, branch)           // creating new userShift
  db().ref().update({ ...update1, ...update2 })
}

export const updateNoteOfShift:ThunkAction = (shiftID: string, noteTxt: string) => (disp, getState) => {
  const weekID = getState().ui.roster.currentWeekID
  db().ref(getFBPath('shiftWeeks', [weekID, shiftID, 'note'])).set(noteTxt)
}
