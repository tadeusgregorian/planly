//@flow
import { createSelector } from 'reselect'
import { smartToMom } from 'helpers/index'
import type { Absence, AbsenceType, Store } from 'types/index'

const getAbsences     = (state: Store) => state.absencePlaner.absences
const getCurrentMonth = (state: Store) => state.ui.absence.currentMonth
const getCurrentType  = (state: Store) => state.ui.absence.currentType

const getAbsencesFiltered = (absences: Array<Absence>, month: number, type: AbsenceType | 'all'): Array<Absence> => {
  return absences.filter(a => {
    if(type !== 'all' && type !== a.type) return false

    const monthStart = smartToMom(a.startDate).month()
    const monthEnd = smartToMom(a.endDate).month()
    return (monthStart <= month && monthEnd >= month)
  })
}

export default createSelector([getAbsences, getCurrentMonth, getCurrentType], getAbsencesFiltered)
