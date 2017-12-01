
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { GetState, User } from 'types/index'


export const updateWeekSums = (getState: GetState, users: Array<User>) => {
  const updates = {}

  users.forEach(user => {
    const shifts = getState().roster.shiftWeek.filter(s => s.user === user)
    const extras = getState().roster.extraHours.filter(e => e.user === user)

    const shiftsSum = shifts.reduce((acc, s) => acc + ( s.e - s.s - s.b ) , 0)
    const extrasSum = extras.reduce((acc, e) => acc + e.mins , 0)

    const key = user + '_' + getState().ui.roster.currentWeekID

    updates[getFBPath('weekSums', [key])] = shiftsSum + extrasSum
  })

  db().ref().update(updates)
}
