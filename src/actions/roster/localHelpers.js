//@flow
import { db } from '../firebaseInit'
import values from 'lodash/values'
import type { PreShift, Shift, User } from 'types/index'
//import { weekDays } from 'constants/roster'
import { getFBPath } from './../actionHelpers'

export const toDBShift = (sh: PreShift, branch: string): Shift => ({
  ...sh,
  b:         sh.b         || 0,
  position:  sh.position  || null, // firebase needs null to delete a node ( undefined throws an error )
  location:  sh.location  || null,
  note:      sh.note      || null,
  isOpen:    sh.isOpen    || null,
  branch:    branch,
  branchDay: branch + sh.day,
})

// returns a object that you can call as an argument for the firebase-update method for db-writes
export const getShiftUpdate = (preShift: PreShift, weekID: string , branch: string, remove: boolean = false) => {
  const shift     = toDBShift(preShift, branch)
  const data      = remove ? null : shift
  return {[ getFBPath('shiftWeeks', [weekID, shift.id])]: data}
}

//$FlowFixMe -> dont know why this is a proglem here
export const fetchTemplateWeek = (tempID: string): Promise<Array<Shift>> => (
  db().ref(getFBPath('shiftWeeks', [tempID])).once('value').then(snap => {
    return snap.val() ? values(snap.val()) : []
  })
)

export const getUserPos = (users: Array<User>, userID: string): string => {
  const user: User = (users.find(u => u.id === userID):any)
  return user.position
}
