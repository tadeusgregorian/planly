//@flow
import { createSelector } from 'reselect'
import { weekDays } from 'constants/roster'
import type { User, Shift, Store, AbsenceWeekly } from 'types/index'
import sortBy from 'lodash/sortBy'
import type { AbsenceType } from 'types/index'

const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID
const getShfits         = (state: Store) => state.roster.shiftWeek
const getAbsences       = (state: Store) => state.roster.absencesWeekly
const getUsers 	        = (state: Store) => state.core.users

const shiftDuringAbsence = (shift, absences: Array<AbsenceWeekly>, weekID): ?AbsenceType => {
  const abs = absences.find(a =>
        a.user === shift.user
    &&  a.firstDay <= weekDays.indexOf(shift.day)
    &&  a.lastDay >= weekDays.indexOf(shift.day)
  )
  return abs ? abs.type : null
}

const getShiftsFiltered = (
  weekID: string,
  shifts: Array<Shift>,
  absences: Array<AbsenceWeekly>,
  users: Array<User>
): Array<Shift & {absent: ?AbsenceType}> => {

  console.log('THIS::::::')
  console.log(shifts)
  console.log(absences)

  const shiftsExt = shifts.map(s => ({
    ...s,
    absent: shiftDuringAbsence(s, absences, weekID),
    prio: s.user === 'open' ? 0 : 1
  }))
  return sortBy(shiftsExt, ['prio', 's'])
}

export default createSelector([getCurrentWeekID, getShfits, getAbsences, getUsers], getShiftsFiltered)
