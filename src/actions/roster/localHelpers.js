//@flow
import type { PreDBShift, DBShift, Shift } from 'types/index'
import { weekDays } from 'constants/roster'
import { smartWeekToMom } from 'helpers/index'
import { getFBPath } from './../actionHelpers'

export const toDBShift = (sh: PreDBShift): DBShift => ({
  ...sh,
  b: sh.b || 0,
  isOpen:  sh.isOpen ? true : false, // firebase needs null to delete a node ( undefined throws an error )
  position: sh.position ? sh.position : null,
  branchDay: (sh.branch + sh.day),
  userDay: (sh.user + sh.day),
})

// returns a object that you can call as an argument for the firebase-update method for db-writes
export const getShiftUpdate = (shift: Shift, weekID: string , branch: string, remove: boolean = false) => {
  const preDBShift  = { ...shift, branch }
  const dbShift     = toDBShift(preDBShift)
  const data        = remove ? null : dbShift
  return {[ getFBPath('shiftWeeks') + weekID + '/' + shift.id]: data}
}

export const getMiniShiftUpdate = (shift: Shift, weekID: string, remove: boolean = false) => {
  const miniShift   = getMini(shift, weekID)
  const data        = remove ? null : miniShift
  return {[ getFBPath('miniShiftWeeks', [weekID, shift.user, shift.id]) ]: data}
}

export const getMini = (shift: Shift, weekID: string): {} => {
  const mins = shift.e - shift.s - ( shift.b || 0)
  const dayNum = weekDays.indexOf(shift.day)
  const date = parseInt(smartWeekToMom(weekID).add( dayNum, 'days').format('YYYYMMDD'), 10)
  return { mins, date }
}
