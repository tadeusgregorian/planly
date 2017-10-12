//@flow
import { createSelector } from 'reselect'
import _ from 'lodash'
import type { Store, User } from 'types/index'

const getUsers         = (state: Store) => state.core.users
const getCurrentWeekID = (state: Store) => state.ui.roster.currentWeekID

const getUsersAdjustedToWeek = (users: Array<User>, weekID: string): Array<User> => {
  return users.map(u => {
    const currentWeek = parseInt(weekID, 10) || 0 // in templateMode WeekID is a string GUID -> return 0


    const weeklyHoursArray = _.keys(u.weeklyHours)

    if(weeklyHoursArray.length === 1){
      return { ...u, currentWeeklyHours: u.weeklyHours[weeklyHoursArray[0]]}
    }else{
      // if entering this else block: the user has changed the weeklyHours in the past.
      // relevantSmartWeek is the smartWeek that holds the applying weeklyHours for this curruntWeek ! -> the closest week to the currentWeek in the past
      const relevantSmartWeek = weeklyHoursArray
        .map(w => parseInt(w, 10))
        .sort()
        .reduce((acc, smartWeek) =>  smartWeek <= currentWeek ? smartWeek : acc, 0)

      return { ...u, currentWeeklyHours: u.weeklyHours[relevantSmartWeek] }
    }
  })
}

export default createSelector([getUsers, getCurrentWeekID], getUsersAdjustedToWeek)
