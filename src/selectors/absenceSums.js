//@flow
import { createSelector } from 'reselect'
import type { Absence, AbsenceType, Store, User } from 'types/index'

const getAbsences     = (state: Store) => state.absencePlaner.absences
const getUsers        = (state: Store) => state.core.users
const getCurrentType  = (state: Store) => state.ui.absence.currentType

const getAbsencesFiltered = (absences: Array<Absence>, users: Array<User>, type: AbsenceType | 'all'): Array<{user: string, days: number}> => {

  return users.map(u => {
    const userAbsences = absences.filter(a => a.user === u.id && (type === 'all' || a.type === type) && a.status === 'accepted' && !a.unpaid )
    const daysSum = userAbsences.reduce((acc, absence)=> acc + absence.effectiveDays, 0)
    return {user: u.id, days: daysSum}
  })
}

export default createSelector([getAbsences, getUsers , getCurrentType], getAbsencesFiltered)
