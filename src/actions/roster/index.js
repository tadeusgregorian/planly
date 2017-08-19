// @flow

import { db } from '../firebaseInit'
import firebase from 'firebase'
import { getFirebasePath } from './../actionHelpers'
import type { PreDBShift } from 'types/index'

export const removeShiftWeek = () => ({type: 'remove_shiftWeek'})

const getShiftKey = (shift) => shift.branch + shift.user + shift.day

const extendShiftForDB = (sh: PreDBShift) => ({
  ...sh,
  b: sh.b || null, // firebase needs null to delete a node ( undefined throws an error )
  branchDay: (sh.branch + sh.day),
  userDay: (sh.user + sh.day)
})

export const writeShiftToDB = (smartWeek: string, shift: PreDBShift) => {
  const dbShift = extendShiftForDB(shift)
  const key = getShiftKey(shift)
  db().ref(getFirebasePath('shiftWeeks')).child(smartWeek).child(key).set(dbShift)
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
