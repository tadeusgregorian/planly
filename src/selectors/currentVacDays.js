//@flow
import { createSelector } from 'reselect'
import type { Store, AbsenceCorrection } from 'types/index'
import mapValues from 'lodash/mapValues'

const getAbsenceCorrections = (state: Store) => state.absencePlaner.absenceCorrections
const getCurrentYear        = (state: Store) => state.ui.absence.currentYear

const getLatestAbsencesCorrections = (absenceCorrections: Array<AbsenceCorrection>, currentYear: number): { [userID: string]: number} => {
  const latestCorrections = {}

  absenceCorrections.forEach(cor => {
    if(cor.year > currentYear) return
    if(!cor.hasOwnProperty('vacDays')) return

    !latestCorrections[cor.user]
      ? (latestCorrections[cor.user] = cor)
      : latestCorrections[cor.user].year < cor.year && (latestCorrections[cor.user] = cor)
  })

  return mapValues(latestCorrections, (cor) => cor.vacDays)
}

export default createSelector([getAbsenceCorrections, getCurrentYear], getLatestAbsencesCorrections)
