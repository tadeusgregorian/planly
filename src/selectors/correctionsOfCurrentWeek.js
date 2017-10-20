//@flow
import { createSelector } from 'reselect'
import type { Correction, Store } from 'types/index'

const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID
const getCorrections    = (state: Store) => state.roster.corrections

const getCurrentCorrections = (currentWeekID: string, corrections: Array<Correction>): {[userID: string]: Correction} => {
  const currentCorrections = {}

  corrections.forEach(c => {
    c.week === currentWeekID && (currentCorrections[c.user] = c)
  })

  return currentCorrections
}

export default createSelector([getCurrentWeekID, getCorrections], getCurrentCorrections)
