//@flow
import { createSelector } from 'reselect'
import type { Store, User } from 'types/index'
import getInitialStartWeeks from './initialStartWeeks'

const getUsers              = (state: Store) => state.core.users
const getCurrentWeekID      = (state: Store) => state.ui.roster.currentWeekID

const getCurrentWeeklyMinsSums = (
  users: Array<User>,
  currentWeekID: string,
  initialStartWeeks): { [userID: string]: number} => {

  const weeklyMinsSums = {}
  users.forEach(u => {
    if(!initialStartWeeks[u.id]) return weeklyMinsSums[u.id] = 0
    

  })

  return weeklyMinsSums
}

export default createSelector([getUsers, getCurrentWeekID, getInitialStartWeeks], getCurrentWeeklyMinsSums)
