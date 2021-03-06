//@flow
import { createSelector } from 'reselect'
import getInitialStartWeeks from './initialStartWeeks'
import getCurrentWeeklyMinsSums from './currentWeeklyMinsSums'
import type { User, Correction } from 'types/index'

const getCurrentWeekID    = (state: Store) => state.ui.roster.currentWeekID
const getCorrections      = (state: Store) => state.roster.corrections
const getWeekSums         = (state: Store) => state.roster.weekSums
const getUsers            = (state: Store) => state.core.users

const extractUser = (weekSumsKey) => weekSumsKey.substr(0,4)
const extractWeek = (weekSumsKey) => weekSumsKey.slice(-6)

const getCurrentOvertimes = (
  currentWeekID:         string,
  corrections:           Array<Correction>,
  initialStartWeeks:     {[userID: string]: string},
  currentWeeklyMinsSums: {[userID: string]: number},
  weekSums:              {[userID_weekID: string]: number},
  users:                 Array<User>
): {[string]: number} => {

    if(!corrections.length) return {}
    if(!users.length)       return {}

    let currentTotalMins = {}

    for(let key in weekSums){ // here we sum up the single weekSums of the users ( we neglect users without an initialStartWeek )
      const user = extractUser(key)
      const week = extractWeek(key)
      const mins = weekSums[key]
      const startWeek = initialStartWeeks[user]

      startWeek && // check if this user has an initial startWeek             -> if not we dont count his overtime
      startWeek <= week && // check if the startWeek is before users weekSum  -> we start counting after users startWeek
      week < currentWeekID && // check if this weekSum is before currentWeek  -> we are not interested in what comes after currentWeek
      (currentTotalMins[user] = mins + (currentTotalMins[user] || 0))
    }

    corrections.forEach(c => {  // here we add corrections the the totalMinutes of the users
      initialStartWeeks[c.user] && // checks if user has an initial startWeek
      initialStartWeeks[c.user] <= c.week && // checks if this correction is after the startWeek of the user
      (currentTotalMins[c.user] = c.mins + (currentTotalMins[c.user] || 0)) // adds the correction to users total minutes sum
    })

    Object.keys(currentTotalMins).forEach(user =>  { // here we remove the minutes the user had to work between startWeek and currentWeek
      const plannedMinutes   = currentWeeklyMinsSums[user]
      currentTotalMins[user] = currentTotalMins[user] - plannedMinutes
    })

    return currentTotalMins
}

export default createSelector([
  getCurrentWeekID,
  getCorrections,
  getInitialStartWeeks,
  getCurrentWeeklyMinsSums,
  getWeekSums,
  getUsers], getCurrentOvertimes)
