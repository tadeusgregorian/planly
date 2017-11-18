//@flow
import moment from 'moment'
import { combineReducers } from 'redux'
import { simpleReducer } from '../reducerHelpers'
import { getRealCurrentWeekID, weekDays } from 'helpers/roster'
import type { PlanMode, Day } from 'types/index'

const currentBranch = simpleReducer({
  default: localStorage.currentBranch || 'b001',
  SET_CURRENT_BRANCH: 'PAYLOAD'
})

const currentWeekID = simpleReducer({
  default: getRealCurrentWeekID(),
  SET_CURRENT_WEEK_ID: 'PAYLOAD',
})

const currentDay = simpleReducer({
  default: weekDays[moment().weekday()],
  SET_CURRENT_DAY: 'PAYLOAD',
})

const planMode = simpleReducer({
  default: 'PERSONAL',
  SET_PLAN_MODE: 'PAYLOAD',
})

export type Roster = {
  planMode: PlanMode,
  currentBranch: string,
  currentWeekID: string,
  currentDay: Day,
}

export default combineReducers({
  planMode,
  currentBranch,
  currentWeekID,
  currentDay,
})
