//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import { getRealCurrentWeekID } from 'helpers/roster'
import shiftBoard from './shiftBoard'
import type { ShiftBoard } from './shiftBoard'

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
  currentTemplate: string,
  templateMode: boolean,
  shiftBoard: ShiftBoard,
  extraHoursMode: boolean,
}

export default combineReducers({
  currentBranch,
  currentWeekID,
  templateMode,
  shiftBoard,
  extraHoursMode,
})
