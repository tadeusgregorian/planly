//@flow
import { getFBPath } from './../actionHelpers'
import { weekDays } from 'constants/roster'
import type { GetState, Day, AbsenceWeekly, PreShift, ExtraHours } from 'types/index'

type Changes = {
  shifts?: Array<PreShift>,
  extraHours?: Array<ExtraHours>
}

export const updateWeekSums = (getState: GetState, changes: Changes, deletion:boolean = false) => {
  const usersInvolved = {}
  changes.shifts     && changes.shifts.forEach(s => usersInvolved[s.user] = true)
  changes.extraHours && changes.extraHours.forEach(s => usersInvolved[s.user] = true)

  const newShifts = arrayToIDObj(changes.shifts || [])
  const newExtras = arrayToIDObj(changes.extraHours || [])

  const storeShifts = arrayToIDObj(getState().roster.shiftWeek)
  const storeExtras = arrayToIDObj(getState().roster.extraHours)

  const comShifts: Array<PreShift>   = (Object.values({ ...storeShifts, ...newShifts }): any)
  const comExtras: Array<ExtraHours> = (Object.values({ ...storeExtras, ...newExtras }): any)

  const shiftsCleaned = comShifts.filter(s => !(deletion && newShifts[s.id])) // remove from obj -> if we are deleating a shift
  const extrasCleaned = comExtras.filter(e => !(deletion && newExtras[e.id])) // remove from obj -> if we are deleating an extraH

  console.log(extrasCleaned);

  const updates = {}
  Object.keys(usersInvolved).forEach(user => {

    const shifts  = shiftsCleaned.filter(a => a.user === user)
    const extras  = extrasCleaned.filter(a => a.user === user)
    const vacs    = getState().roster.absencesWeekly.filter(a => a.user === user && a.type === 'vac')

    const shiftsSum = shifts.reduce((acc, s)   => (curVac(vacs, s.day) ? 0 : ( s.e - s.s - s.b )) + acc , 0)
    const vacsSum   = weekDays.reduce((acc, d) => earningInVac(vacs, d) + acc , 0)
    const extrasSum = extras.reduce((acc, e)   => acc + e.mins , 0)

    const key = user + '_' + getState().ui.roster.currentWeekID
    updates[getFBPath('weekSums', [key])] = shiftsSum + extrasSum + vacsSum

  })
  return updates
}

const curVac = (vacs: Array<AbsenceWeekly>, day: Day): ?AbsenceWeekly => {
  const d: number = weekDays.indexOf(day)
  return vacs.find(v => v.firstDay <= d && v.lastDay >= d)
}

const earningInVac = (vacs: Array<AbsenceWeekly>, day: Day): number => {
  const vac = curVac(vacs, day)
  return (vac && vac.workDays[day]) ? vac.avgMins : 0
}

const arrayToIDObj = <T: { id: string }>(arr: Array<T>): {[id: string]: T} => (
    arr.reduce((acc, el) => ({ ...acc, [el.id]: el }) , {})
)
