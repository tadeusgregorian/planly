// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { generateGuid } from 'helpers/index'
import { updateWeekSums } from './weekSums'
import { getShiftUpdate, getShiftPerMonthUpdate, getUserPos } from './localHelpers'
import type { PreShift, Shift, Day, ThunkAction, GetState, MinimalShift } from 'types/index'

export const saveShiftToDB:ThunkAction = (shifts: Array<PreShift>, deleteIt = false, otherUpdate = {}) => (disp, getState: GetState) => {
  const branch        = getState().ui.roster.currentBranch
  const weekID        = getState().ui.roster.currentWeekID

  let weekSumUpdates = updateWeekSums(getState, {shifts: shifts}  , deleteIt)
  let shiftUpdates, shiftPMUpdates   = {}

  shifts.forEach(s => shiftUpdates = { ...shiftUpdates, ...getShiftUpdate(s, weekID, branch, deleteIt)} )
  shifts.forEach(s => shiftPMUpdates = { ...shiftPMUpdates, ...getShiftPerMonthUpdate(s, weekID, branch, deleteIt)} )

  db().ref().update({ ...shiftUpdates, ...weekSumUpdates, ...shiftPMUpdates, ...otherUpdate })
}

export const saveShiftEditToDB:ThunkAction = (shift: PreShift, shiftEdit: MinimalShift ) => (disp, getState) => {
  const weekID  = getState().ui.roster.currentWeekID
  const branch  = getState().ui.roster.currentBranch
  const update1 = {[ getFBPath('shiftEdits',     [shift.id]) ]: { shiftID: shift.id, branch, weekID }}
  const update2 = {[ getFBPath('shiftWeeks',     [weekID, shift.id, 'edit']) ]: shiftEdit }
  db().ref().update({ ...update1, ...update2 })
}

export const acceptEdit: ThunkAction = (shift: PreShift) => (disp, getState) => {
  const edit             = (shift.edit: any)
  const newShift         = { ...shift, s: edit.s, e: edit.e, b: edit.b, edit: null }
  const shiftEditsUpdate = {[ getFBPath('shiftEdits', [shift.id]) ]:  null}
  saveShiftToDB([newShift], false, shiftEditsUpdate)(disp, getState)
}

export const rejectEdit: ThunkAction = (shift: Shift) => (disp, getState) => {
  const weekID  = getState().ui.roster.currentWeekID
  const update1 = {[ getFBPath('shiftWeeks', [weekID, shift.id, 'edit'])]: null}
  const update2 = {[ getFBPath('shiftEdits', [shift.id]) ]: null}
  db().ref().update({ ...update1, ...update2})
}

// used when shift is being dragg-and-dropped from one cell to another
export const copyShiftTo:ThunkAction = (shiftID: string, user: string, day: Day) => (disp, getState: GetState) => {
  const shift       = getState().roster.shiftWeek.find(s => s.id === shiftID )
  const newShift    = { ...shift, id: generateGuid(), user, day }
  saveShiftToDB([newShift])(disp, getState)
}

// used when open-shift is dragged to UserCell , or user-shift is dragged to openCell
type MoveShiftTo = (shiftID: string, userID: string, Day) => (Dispatch, GetState) => void
export const moveShiftTo: MoveShiftTo = (shiftID, targetUser, targetDay) => (disp, getState) => {
  const shifts          = getState().roster.shiftWeek
  const users           = getState().core.users
  const shift:Shift     = (shifts.find(s => s.id === shiftID):any)
  const userShiftToOpen = shift.user !== 'open' && targetUser === 'open'
  const openShiftToUser = shift.user === 'open' && targetUser !== 'open'
  const newShift        = { ...shift, user: targetUser, day: targetDay }

  userShiftToOpen && (newShift.position = getUserPos(users, shift.user))
  openShiftToUser && (newShift.position = null)

  saveShiftToDB([newShift])(disp, getState)
}

export const updateNoteOfShift:ThunkAction = (shiftID: string, noteTxt: string) => (disp, getState) => {
  const weekID = getState().ui.roster.currentWeekID
  db().ref(getFBPath('shiftWeeks', [weekID, shiftID, 'note'])).set(noteTxt)
}
