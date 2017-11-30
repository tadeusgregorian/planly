//@flow
import { createSelector } from 'reselect'
import type { Store, User } from 'types/index'
import mapValues from 'lodash/mapValues'

const getUsers         = (state: Store) => state.core.users
const getCurrentWeekID = (state: Store) => state.ui.roster.currentWeekID

const getCurrentWeeklyMins = (users: Array<User>, currentWeekID: string): { [userID: string]: number} => {

  users.map(u => {
    let current = { year: 200001, mins: 0 }
    u.weeklyMins

  })

}

export default createSelector([getUsers, getCurrentWeekID], getCurrentWeeklyMins)
