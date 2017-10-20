//@flow
import { createSelector } from 'reselect'
import type { User, Correction } from 'types/index'

const getUsers          = (state: Store) => state.core.users
const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID
const getCorrections    = (state: Store) => state.roster.corrections
const getWeekSums       = (state: Store) => state.roster.weekSums

const getCurrentOvertimes = (
  users: Array<User>,
  currentWeekID: string,
  corrections: Array<Correction>,
  weekSums: {[string]: number}): {[string]: number} => {

    const currentWeekSums = {}
    users.filter(u => u.branches[currentBranch]).forEach(u => {
        currentWeekSums[u.id] = weekSums[u.id +'_'+currentWeekID] || 0
    })
    return currentWeekSums
}

export default createSelector([getUsers, getCurrentWeekID, getCorrections, getWeekSums], getCurrentOvertimes)
