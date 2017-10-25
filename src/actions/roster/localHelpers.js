//@flow
import { db } from '../firebaseInit'
import _ from 'lodash'
import type { PreDBShift, DBShift, Shift } from 'types/index'
import { weekDays } from 'constants/roster'
import { getFBPath } from './../actionHelpers'

export const toDBShift = (sh: PreDBShift): DBShift => ({
  ...sh,
  b:         sh.b         || 0,
  isOpen:    sh.isOpen    || null, // firebase needs null to delete a node ( undefined throws an error )
  position:  sh.position  || null,
  location:  sh.location  || null,
  note:      sh.note      || null,
  branchDay: sh.branch + sh.day,
  userDay:   sh.user + sh.day,
})

// returns a object that you can call as an argument for the firebase-update method for db-writes
export const getShiftUpdate = (shift: Shift, weekID: string , branch: string, remove: boolean = false) => {
  const preDBShift  = { ...shift, branch }
  const dbShift     = toDBShift(preDBShift)
  const data        = remove ? null : dbShift
  return {[ getFBPath('shiftWeeks', [weekID, shift.id])]: data}
}

export const getMiniShiftUpdate = (shift: Shift, weekID: string, remove: boolean = false) => {
  const miniShift   = getMini(shift)
  const data        = remove ? null : miniShift
  return {[ getFBPath('miniShiftWeeks', [weekID, shift.user, shift.id]) ]: data}
}

export const getMini = (shift: Shift): {mins: number, weekDay: number} => {
  const mins = shift.e - shift.s - ( shift.b || 0)
  const weekDay = weekDays.indexOf(shift.day) // as number ( 0 - 6 ) instead of type: ('mo' - 'su')
  return { mins, weekDay }
}

export const fetchTemplateWeek = (tempID: string): Promise<Array<Shift>> => (
  db().ref(getFBPath('shiftWeeks', [tempID])).once('value').then(snap => {
    return snap.val() ? _.values(snap.val()) : []
  })
)
