// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { generateGuid } from 'helpers/index'
import { getShiftUpdate, getMiniShiftUpdate, getMini, getUserPos } from './localHelpers'
import type { PreShift, Shift, Day, ThunkAction, GetState, MinimalShift } from 'types/index'

export const saveShiftToDB:ThunkAction = (shift: PreShift, deleteIt = false) => (disp, getState: GetState) => {
  const branch        = getState().ui.roster.currentBranch
  const weekID        = getState().ui.roster.currentWeekID
  const templateMode  = getState().ui.roster.templateMode
  const isOpenShift   = shift.user === 'open'

  const update1       = getShiftUpdate(shift, weekID, branch, deleteIt)
  const update2       = (templateMode || isOpenShift) ? {} : getMiniShiftUpdate(shift, weekID, deleteIt)
  db().ref().update({ ...update1, ...update2 })
}

export const saveShiftEditToDB:ThunkAction = (shift: PreShift, shiftEdit: MinimalShift ) => (disp, getState) => {
  const weekID  = getState().ui.roster.currentWeekID
  const branch  = getState().ui.roster.currentBranch
  const update1 = {[ getFBPath('shiftEdits',     [shift.id]) ]: { shiftID: shift.id, branch, weekID }}
  const update2 = {[ getFBPath('shiftWeeks',     [weekID, shift.id, 'edit']) ]: shiftEdit }
  //const update3 = getMiniShiftUpdate(shift, weekID)
  db().ref().update({ ...update1, ...update2 })
}

export const acceptEdit: ThunkAction = (shift: PreShift) => (disp, getState) => {
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

export const copyShiftTo:ThunkAction = (shiftID: string, user: string, day: Day) => (disp, getState: GetState) => {
  const shift       = getState().roster.shiftWeek.find(s => s.id === shiftID )
  const newShift    = { ...shift, id: generateGuid(), user, day }
  saveShiftToDB(newShift)(disp, getState)
}

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

  saveShiftToDB(newShift)(disp, getState)
}

export const updateNoteOfShift:ThunkAction = (shiftID: string, noteTxt: string) => (disp, getState) => {
  const weekID = getState().ui.roster.currentWeekID
  db().ref(getFBPath('shiftWeeks', [weekID, shiftID, 'note'])).set(noteTxt)
}
