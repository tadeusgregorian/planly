//@flow
import { createSelector } from 'reselect'
import type { User, Store } from 'types/index'

const getUsers          = (state: Store) => state.core.users
const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID
const getWeekSums       = (state: Store) => state.roster.weekSums

const getCurrentWeekSums = (
  users: Array<User>,
  currentWeekID: string,
  weekSums: {[string]: number}): {[userID: string]: number} => {

    const currentWeekSums = {}
    users.forEach(u => {
        currentWeekSums[u.id] = weekSums[u.id +'_'+currentWeekID] || 0
    })
    return currentWeekSums
}

export default createSelector([getUsers, getCurrentWeekID, getWeekSums], getCurrentWeekSums)
