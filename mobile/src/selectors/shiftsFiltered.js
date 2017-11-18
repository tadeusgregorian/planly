//@flow
import { createSelector } from 'reselect'
import { weekDays } from 'helpers/roster'
import type { User, Shift, Store, WeekAbsence } from 'types/index'
import sortBy from 'lodash/sortBy'

const getShfits      = (state: Store) => state.roster.shiftWeek
const getAbsences    = (state: Store) => state.roster.weekAbsences
const getUsers 	     = (state: Store) => state.core.users

const shiftDuringAbsence = (shift, absences): boolean => {
  return !!absences.find(a =>
        a.user === shift.user
    &&  a.firstWeekDay <= weekDays.indexOf(shift.day)
    &&  a.lastWeekDay  >= weekDays.indexOf(shift.day)
  )
}

const getShiftsFiltered = (
  shifts: Array<Shift>,
  absences: Array<WeekAbsence>,
  users: Array<User>
): Array<Shift> => {

  const nonAbsentShifs = shifts.filter(s => !shiftDuringAbsence(s, absences))
  const shiftsExt = nonAbsentShifs.map(s => ({ ...s, prio: s.user === 'open' ? 0 : 1  }))
  const sortedShifts = sortBy(shiftsExt, ['prio', 's'])
  return sortedShifts
}

export default createSelector([getShfits, getAbsences, getUsers], getShiftsFiltered)
