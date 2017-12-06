//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { weekDays } from 'constants/roster'
import type { GetState, Day, AbsenceWeekly } from 'types/index'


export const updateWeekSums = (getState: GetState, users: Array<string>) => {
  const updates = {}

  users.forEach(user => {

    const shifts  = getState().roster.shiftWeek.filter(s => s.user === user)
    const extras  = getState().roster.extraHours.filter(e => e.user === user)
    const vacs    = getState().roster.absencesWeekly.filter(a => a.user === user && a.type === 'vac')

    const shiftsSum = shifts.reduce((acc, s)   => (curVac(vacs, s.day) ? 0 : ( s.e - s.s - s.b )) + acc , 0)
    const vacsSum   = weekDays.reduce((acc, d) => earningInVac(vacs, d) + acc , 0)
    const extrasSum = extras.reduce((acc, e)   => acc + e.mins , 0)

    const key = user + '_' + getState().ui.roster.currentWeekID
    updates[getFBPath('weekSums', [key])] = shiftsSum + extrasSum + vacsSum
  })

  db().ref().update(updates)
}

const curVac = (vacs: Array<AbsenceWeekly>, day: Day): ?AbsenceWeekly => {
  const d: number = weekDays.indexOf(day)
  return vacs.find(v => v.firstDay <= d && v.lastDay >= d)
}

const earningInVac = (vacs: Array<AbsenceWeekly>, day: Day): number => {
  const vac = curVac(vacs, day)
  return (vac && vac.workDays[day]) ? vac.avgMins : 0
}
