//@flow
import { momToSmart } from 'helpers/index';

import { db } from '../firebaseInit'
import omit from 'lodash/omit';
import values from 'lodash/values'
import type { PreShift, Shift, User } from 'types/index'
import { weekDays } from 'constants/roster'
import { weekIDToMoment } from 'helpers/roster'
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

export const fetchTemplateWeek = (tempID: string): Promise<Array<Shift>> => (
  db().ref(getFBPath('shiftWeeks', [tempID])).once('value').then(snap => {
    return snap.val() ? values(snap.val()) : []
  })
)

export const getUserPos = (users: Array<User>, userID: string): string => {
  const user: User = (users.find(u => u.id === userID):any)
  return user.position
}

export const getShiftListUpdate = (
  preShift: PreShift,
  weekID: string ,
  branch: string,
  remove: ?boolean = false,
  isTemplate: ?boolean = false,
) => {

  const shift       = { ...toDBShift(preShift, branch) }
  const mom         = !isTemplate && weekIDToMoment(weekID).weekday(weekDays.indexOf(shift.day))
  shift.weekID      = weekID
  shift.mins        = shift.e - shift.s - shift.b
  shift.date        = (isTemplate || !mom) ? null : momToSmart(mom) // templateShift has no date -> marked as null
  shift.monthID     = (isTemplate || !shift.date) ? null : shift.date.toString().substr(0,6) // templateShift has no date -> marked as null
  shift.userMonthID = (isTemplate || !shift.monthID) ? null : shift.user + '_' + shift.monthID

  return  {[ getFBPath('shiftList', [shift.id]) ]: remove ? null : shift }
}

export const getWeekSumsRequestUpdate = (userIDs: Array<string>, weekID: string) => {
  const updates = {}
  userIDs.forEach(uid => {
    updates[ getFBPath('weekSumsUpdateRequests', [weekID, uid])] = true
  })
  return updates
}
