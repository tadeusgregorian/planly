//@flow
import { createSelector } from 'reselect'
import getInitialStartWeeks from './initialStartWeeks'
import { beginningOfTime } from 'constants/roster'
import { weeksDiff } from 'helpers/index'
import type { Store, User } from 'types/index'

const getUsers              = (state: Store) => state.core.users
const getCurrentWeekID      = (state: Store) => state.ui.roster.currentWeekID

// returns an array of smartWeeks -> [initialStartWeek, someWeek, someWeek, currentWeek]
const createRangesArray = (weeklyMins: {[string]: number}, initialStartWeek: string, currentWeek: string): Array<{ sw: string, mins: number }> => {
  const rangesArray = [{ sw: initialStartWeek, mins: weeklyMins[beginningOfTime] }]

  const weeklyMinsArr = Object.keys(weeklyMins).sort()
  weeklyMinsArr.forEach(sw => {
    if(sw >= initialStartWeek && sw < currentWeek) rangesArray.push({ sw: sw, mins: weeklyMins[sw] })
  })

  rangesArray.push({ sw:currentWeek, mins: 0}) // this mins can be anything -> the value of mins is not being used later on
  return rangesArray
}

const getDurationAndMins = (rangesArray: Array<{ sw: string, mins: number }>): Array<{ weeks: number, mins: number }> => {
  const durationsAndMins = []
  rangesArray.forEach((range, i) => {
    if(i === rangesArray.length - 1) return // we are at the last element ( at current Week ) leave here
    const weeks = weeksDiff(range.sw, rangesArray[i + 1].sw)
    durationsAndMins.push({ weeks: weeks, mins: range.mins })
  })
  return durationsAndMins
}

const getCurrentWeeklyMinsSums = (
  users: Array<User>,
  currentWeekID: string,
  initialStartWeeks): { [userID: string]: number} => {

  const weeklyMinsSums = {}
  users.forEach(u => {
    if(!initialStartWeeks[u.id]) return weeklyMinsSums[u.id] = 0
    const initialStartWeek = initialStartWeeks[u.id].toString()
    const durationAndMins  = getDurationAndMins(createRangesArray(u.weeklyMins, initialStartWeek, currentWeekID ))
    const finalSum         = durationAndMins.reduce((acc, val) => acc + val.weeks * val.mins , 0)
    weeklyMinsSums[u.id] = finalSum
  })

  return weeklyMinsSums
}

export default createSelector([getUsers, getCurrentWeekID, getInitialStartWeeks], getCurrentWeeklyMinsSums)
