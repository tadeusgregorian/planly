//@flow
import { createSelector } from 'reselect'
import { weekDays } from 'constants/roster'
import type { User, Shift, Store, Absence } from 'types/index'
import { weekIDToMoment } from 'helpers/roster'
import { momToSmart } from 'helpers/index'
import sortBy from 'lodash/sortBy'

const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID
const getShfits         = (state: Store) => state.roster.shiftWeek
const getAbsences       = (state: Store) => state.absencePlaner.absences
const getUsers 	        = (state: Store) => state.core.users

const smartDateOfShift = (shift: Shift, weekID: string ): number =>
  momToSmart(weekIDToMoment(weekID).weekday(weekDays.indexOf(shift.day)))


const shiftDuringAbsence = (shift, absences, weekID): boolean => {
  return !!absences.find(a =>
        a.user === shift.user
    &&  a.startDate <= smartDateOfShift(shift, weekID)
    &&  a.endDate >= smartDateOfShift(shift, weekID)
  )
}

const getShiftsFiltered = (
  weekID: string,
  shifts: Array<Shift>,
  absences: Array<Absence>,
  users: Array<User>
): Array<Shift> => {

  const nonAbsentShifs = shifts.filter(s => !shiftDuringAbsence(s, absences, weekID))
  const shiftsExt = nonAbsentShifs.map(s => ({ ...s, prio: s.user === 'open' ? 0 : 1  }))
  const sortedShifts = sortBy(shiftsExt, ['prio', 's'])
  return sortedShifts
}

export default createSelector([getCurrentWeekID, getShfits, getAbsences, getUsers], getShiftsFiltered)
