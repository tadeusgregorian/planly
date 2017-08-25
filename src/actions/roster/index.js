// @flow

import { db } from '../firebaseInit'
import firebase from 'firebase'
import { getFirebasePath } from './../actionHelpers'
import type { PreDBShift, DBShift } from 'types/index'

export const removeShiftWeek = () => ({type: 'remove_shiftWeek'})

const getShiftKey = (shift) => shift.branch + shift.user + shift.day
const getShiftEditKey = (shift, smartWeek) => smartWeek + getShiftKey(shift)

const extendShiftForDB = (sh: PreDBShift): DBShift => (
  sh.s === 0 && sh.e === 0 ?
    null :
    {
    ...sh,
    b: sh.b || 0,
    isOpen: (!!sh.isOpen) || null, // firebase needs null to delete a node ( undefined throws an error )
    branchDay: (sh.branch + sh.day),
    userDay: (sh.user + sh.day)
  }
)

export const writeShiftToDB = (smartWeek: string, shift: PreDBShift, isAdmin: boolean) =>
  isAdmin ? writeShiftToShiftWeek(smartWeek, shift) : writeShiftToShiftEdits(smartWeek, shift)

const writeShiftToShiftWeek = (smartWeek: string, shift: PreDBShift) => {
  const key = getShiftKey(shift)
  const dbShift = extendShiftForDB(shift)
  db().ref(getFirebasePath('shiftWeeks')).child(smartWeek).child(key).set(dbShift)
}

const writeShiftToShiftEdits = (smartWeek: string, shift: PreDBShift) => {
  const key = getShiftEditKey(shift, smartWeek)
  const dbShift = extendShiftForDB(shift)
  const dbShiftEdit = { ...dbShift, smartWeek }
  db().ref(getFirebasePath('shiftEdits')).child(key).set(dbShiftEdit)
}

export type PreDBNote = {
  smartWeek: string,
  branch: string,
  author: string,
  text: string,
  type: string,
  user?: string,
  day: string
}

export const writeNoteToDB = ({smartWeek, branch, author, text, type, user, day}: PreDBNote) => {
  const timeStamp         = firebase.database.ServerValue.TIMESTAMP
  const id                = (type === 'shiftNote' && user) ? (branch + user + day + author) : (branch + day + author)
  db().ref(getFirebasePath('notes')).child(smartWeek).child(id).set({branch, user, day, author, timeStamp, type, text, id})
}
