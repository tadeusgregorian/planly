// @flow

import { db } from '../firebaseInit'
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

// export const createDummyShift = () => {
//   const dummy = {s: 200, e: 500, b: 30, user: 'u003', day: 'mo', branch: 'b001', userDay: 'u003mo', branchDay: 'b001mo'}
//
//   db().ref(getFirebasePath('shiftWeeks')).child('201735/b001u003mo').set(dummy)
// }
