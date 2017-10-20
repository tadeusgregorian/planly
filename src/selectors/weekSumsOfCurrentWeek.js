//@flow
import { createSelector } from 'reselect'
import type { User, Store } from 'types/index'

const getUsers          = (state: Store) => state.core.users
const getCurrentBranch  = (state: Store) => state.ui.roster.currentBranch
const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID
const getWeekSums       = (state: Store) => state.roster.weekSums

const getCurrentWeekSums = (
  users: Array<User>,
  currentBranch: string,
  currentWeekID: string,
  weekSums: {[string]: number}): {[userID: string]: number} => {

    const currentWeekSums = {}
    users.filter(u => u.branches[currentBranch]).forEach(u => {
        currentWeekSums[u.id] = weekSums[u.id +'_'+currentWeekID] || 0
    })
    return currentWeekSums
}

export default createSelector([getUsers, getCurrentBranch, getCurrentWeekID, getWeekSums], getCurrentWeekSums)
