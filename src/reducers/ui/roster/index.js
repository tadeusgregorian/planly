//@flow
import moment from 'moment'
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import { weekDays } from 'constants/roster'
import { getRealCurrentWeekID } from 'helpers/roster'

import shiftBoard from './shiftBoard'
import mobile from './mobile'

import type { Day, PlanMode } from 'types/index'
import type { ShiftBoard } from './shiftBoard'
import type { Mobile } from './mobile'

const currentBranch = simpleReducer({
  default: localStorage.currentBranch || 'b001',
  SET_CURRENT_BRANCH: 'PAYLOAD'
})

const currentWeekID = simpleReducer({
  default: getRealCurrentWeekID(),
  SET_CURRENT_WEEK_ID: 'PAYLOAD',
  ENTER_TEMPLATE_MODE: 'PAYLOAD',
  LEAVE_TEMPLATE_MODE: getRealCurrentWeekID(),
})

// Mobile only
const currentDay = simpleReducer({
  default: weekDays[moment().weekday()],
  SET_CURRENT_DAY: 'PAYLOAD',
})

// Mobile only
const planMode = simpleReducer({
  default: 'PERSONAL',
  SET_PLAN_MODE: 'PAYLOAD',
})

const templateMode = simpleReducer({
  default: false,
  ENTER_TEMPLATE_MODE: true,
  LEAVE_TEMPLATE_MODE: false,
})

const extraHoursMode = simpleReducer({
  default: false,
  ENTER_EXTRA_HOURS_MODE: true,
  LEAVE_EXTRA_HOURS_MODE: false,
})

export type Roster = {
  currentBranch: string,
  currentWeekID: string,
  currentDay: Day,
  templateMode: boolean,
  shiftBoard: ShiftBoard,
  extraHoursMode: boolean,
  planMode: PlanMode,
  mobile: Mobile,
}

export default combineReducers({
  currentBranch,
  currentWeekID,
  currentDay,
  templateMode,
  shiftBoard,
  extraHoursMode,
  planMode,
  mobile
})
