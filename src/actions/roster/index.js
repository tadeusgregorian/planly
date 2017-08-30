// @flow

import { db } from '../firebaseInit'
import firebase from 'firebase'
import { getFirebasePath } from './../actionHelpers'
import { generateGuid } from 'helpers/general'
import type { PreDBShift, DBShift, Shift, ShiftEdit, DBShiftEdit, ThunkAction, PreDBNote, GetState } from 'types/index'

export const removeShiftWeek = () => ({type: 'remove_shiftWeek'})

const getShiftKey = (shift: PreDBShift | ShiftEdit) => shift.branch + shift.user + shift.day
const getShiftEditKey = (shiftEdit: ShiftEdit) => shiftEdit.smartWeek + getShiftKey(shiftEdit)

const toDBShift = (sh: PreDBShift): DBShift => ({
  ...sh,
  b: sh.b || 0,
  isOpen:  sh.isOpen ? true : null, // firebase needs null to delete a node ( undefined throws an error )
  position: sh.position ? sh.position : null,
  branchDay: (sh.branch + sh.day),
  userDay: (sh.user + sh.day)
})

const toDBShiftEdit = (sh: ShiftEdit): DBShiftEdit => ({
  ...sh,
  b: sh.b || 0,
  branchDay: (sh.branch + sh.day),
  userDay: (sh.user + sh.day)
})

export const saveShiftToDB:ThunkAction = (shift: Shift) => (disp, getState: GetState) => {
  const branch        = getState().ui.roster.currentBranch
  const smartWeek     = getState().ui.roster.currentSmartWeek
  const tempID        = getState().ui.roster.currentTemplate
  const templateMode  = getState().ui.roster.templateMode
  templateMode
    ? db().ref().update( getShiftUpdate(shift, tempID, branch, false, true) )
    : db().ref().update( getShiftUpdate(shift, smartWeek, branch) )
}

export const saveShiftEditToDB:ThunkAction = (shift: Shift) => (disp, getState) => {
  const smartWeek = getState().ui.roster.currentSmartWeek
  const branch    = getState().ui.roster.currentBranch
  const update    = getShiftEditUpdate(shift, smartWeek, branch)
  db().ref().update(update)
}

// takes a Shift as an argument and turns it into a ShiftEdit -> because AddEditPopover sends a shift to this
const getShiftEditUpdate = (shift: Shift, smartWeek: number, branch: string, remove = false) => {
  const shiftEdit: ShiftEdit = { ...shift, smartWeek, branch }
  const dbShiftEdit          = toDBShiftEdit(shiftEdit)
  const data                 = remove ? null : dbShiftEdit
  const key = getShiftEditKey(shiftEdit)
  return {[ getFirebasePath('shiftEdits') + key]: data}
}

const getShiftUpdate = (shift: Shift, targetID: number | string , branch: string, remove = false, template = false) => {
  const preDBShift  = { ...shift, branch }
  const dbShift     = toDBShift(preDBShift)
  const data        = remove ? null : dbShift
  const key         = getShiftKey(preDBShift)
  const location    = template ? 'templateWeeks' : 'shiftWeeks'
  return {[ getFirebasePath(location) + targetID + '/' + key]: data}
}

export const acceptEdit = (shiftEdit: ShiftEdit) => {
  const { smartWeek, branch } = shiftEdit
  const asShift: Shift = (shiftEdit: any) // explicit type casting for flow...
  const update1 = getShiftEditUpdate(asShift, smartWeek, branch, true)
  const update2 = getShiftUpdate(asShift, smartWeek, branch)
  db().ref().update({ ...update1, ...update2 })
}

export const rejectEdit = (shiftEdit: ShiftEdit) => {
  const { smartWeek, branch } = shiftEdit
  const asShift: Shift = (shiftEdit: any) // explicit type casting for flow...
  const update = getShiftEditUpdate(asShift, smartWeek, branch, true)
  db().ref().update(update)
}

export const assignOpenShift:ThunkAction = (openShift: Shift, user: string) => (disp, getState) => {
  const smartWeek = getState().ui.roster.currentSmartWeek
  const branch    = getState().ui.roster.currentBranch
  const { s, e, b, day } = openShift
  const shift: Shift = { s, e, b, day, user }
  const update1 = getShiftUpdate(openShift, smartWeek, branch, true) // deleting openShift
  const update2 = getShiftUpdate(shift, smartWeek, branch)           // creating new userShift
  db().ref().update({ ...update1, ...update2 })
}



export const writeNoteToDB = ({smartWeek, branch, author, text, type, user, day}: PreDBNote) => {
  const timeStamp         = firebase.database.ServerValue.TIMESTAMP
  const id                = (type === 'shiftNote' && user) ? (branch + user + day + author) : (branch + day + author)
  db().ref(getFirebasePath('notes')).child(smartWeek).child(id).set({branch, user, day, author, timeStamp, type, text, id})
}

export const createNewTempForBranch = (branch: string) => {
  const tempID  = generateGuid()
  const tempObj = { id: tempID, name: 'unbenannt', branch }
  const path    = getFirebasePath('templatesFlat')
  return db().ref(path).child(tempID).set(tempObj).then(()=> tempID)
}

export const saveTemplateName = (tempID: string, name: string) => {
  console.log(tempID);
  console.log(name);
  const path    = getFirebasePath('templatesFlat')
  db().ref(path).child(tempID).child('name').set(name)
}
