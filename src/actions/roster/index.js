// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { getShiftUpdate, getMiniShiftUpdate, getMini } from './localHelpers'
import type { Shift, ThunkAction, GetState, MinimalShift } from 'types/index'

export const saveShiftToDB:ThunkAction = (shift: Shift, deleteIt = false) => (disp, getState: GetState) => {
  const branch        = getState().ui.roster.currentBranch
  const weekID        = getState().ui.roster.currentWeekID
  const templateMode  = getState().ui.roster.templateMode
  const isOpenShift   = shift.user === 'open'

  const update1       = getShiftUpdate(shift, weekID, branch, deleteIt)
  const update2       = (templateMode || isOpenShift) ? {} : getMiniShiftUpdate(shift, weekID, deleteIt)
  db().ref().update({ ...update1, ...update2 })
}

export const saveShiftEditToDB:ThunkAction = (shift: Shift, shiftEdit: MinimalShift ) => (disp, getState) => {
  const weekID  = getState().ui.roster.currentWeekID
  const branch  = getState().ui.roster.currentBranch
  const update1 = {[ getFBPath('shiftEdits',     [shift.id]) ]: { shiftID: shift.id, branch, weekID }}
  const update2 = {[ getFBPath('shiftWeeks',     [weekID, shift.id, 'edit']) ]: shiftEdit }
  const update3 = getMiniShiftUpdate(shift, weekID)
  db().ref().update({ ...update1, ...update2, ...update3 })
}

export const acceptEdit: ThunkAction = (shift: Shift) => (disp, getState) => {
  const weekID  = getState().ui.roster.currentWeekID
  const newShift: MinimalShift = ( shift.edit: any)
  const mini = getMini({ ...shift, ...newShift })
  const updates = {}
  updates[ getFBPath('shiftWeeks',     [weekID, shift.id, 's']) ] = newShift.s
  updates[ getFBPath('shiftWeeks',     [weekID, shift.id, 'e']) ] = newShift.e
  updates[ getFBPath('shiftWeeks',     [weekID, shift.id, 'b']) ] = newShift.b
  updates[ getFBPath('miniShiftWeeks', [weekID, shift.user, shift.id]) ] = mini
  updates[ getFBPath('shiftWeeks',     [weekID, shift.id, 'edit'])] = null
  updates[ getFBPath('shiftEdits',     [shift.id]) ] =  null
  db().ref().update(updates)
}

export const rejectEdit: ThunkAction = (shift: Shift) => (disp, getState) => {
  const weekID  = getState().ui.roster.currentWeekID
  const update1 = {[ getFBPath('shiftWeeks', [weekID, shift.id, 'edit'])]: null}
  const update2 = {[ getFBPath('shiftEdits', [shift.id]) ]: null}
  db().ref().update({ ...update1, ...update2})
}

export const assignOpenShift:ThunkAction = (openShift: Shift, user: string) => (disp, getState: GetState) => {
  const weekID        = getState().ui.roster.currentWeekID
  const branch        = getState().ui.roster.currentBranch
  const templateMode  = getState().ui.roster.templateMode
  const { s, e, b, day, id } = openShift
  const shift: Shift = { s, e, b, day, user, id }
  const update1 = getShiftUpdate(openShift, weekID, branch, true) // deleting openShift
  const update2 = getShiftUpdate(shift, weekID, branch)           // creating new userShift
  const update3 = templateMode ? {} : getMiniShiftUpdate(shift, weekID)
  db().ref().update({ ...update1, ...update2, ...update3 })
}

export const updateNoteOfShift:ThunkAction = (shiftID: string, noteTxt: string) => (disp, getState) => {
  const weekID = getState().ui.roster.currentWeekID
  db().ref(getFBPath('shiftWeeks', [weekID, shiftID, 'note'])).set(noteTxt)
}
