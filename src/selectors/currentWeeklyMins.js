//@flow
import { createSelector } from 'reselect'
import { beginningOfTime } from 'constants/roster'
import type { Store, User } from 'types/index'

const getUsers         = (state: Store) => state.core.users
const getCurrentWeekID = (state: Store) => state.ui.roster.currentWeekID

const getCurrentWeeklyMins = (users: Array<User>, currentWeekID: string): { [userID: string]: number} => {
  const weeklyMinsOfUsers = {}

  users.forEach(u => {
    let latestWeek = beginningOfTime // needs to be a string, we compare smartWeeks as strings here...
    Object.keys(u.weeklyMins).forEach(w => {
      w <= currentWeekID && w > latestWeek && (latestWeek = w)
    })
    weeklyMinsOfUsers[u.id] = u.weeklyMins[latestWeek]
  })
  return weeklyMinsOfUsers
}

export default createSelector([getUsers, getCurrentWeekID], getCurrentWeeklyMins)
