import type { PreDBShift, DBShift } from 'types/index'
import { getFBPath } from './../actionHelpers'

export const toDBShift = (sh: PreDBShift): DBShift => ({
  ...sh,
  b: sh.b || 0,
  isOpen:  sh.isOpen ? true : false, // firebase needs null to delete a node ( undefined throws an error )
  position: sh.position ? sh.position : null,
  branchDay: (sh.branch + sh.day),
  userDay: (sh.user + sh.day)
})

// returns a object that you can call as an argument for the firebase-update method for db-writes
export const getShiftUpdate = (shift: Shift, targetID: number | string , branch: string, remove = false) => {
  const preDBShift  = { ...shift, branch }
  const dbShift     = toDBShift(preDBShift)
  const data        = remove ? null : dbShift
  return {[ getFBPath('shiftWeeks') + targetID + '/' + shift.id]: data}
}
