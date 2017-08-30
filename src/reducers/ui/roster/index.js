//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import { getRealCurrentSmartWeek } from 'helpers/index'
import shiftBoard from './shiftBoard'
import type { ShiftBoard } from './shiftBoard'

const currentBranch = simpleReducer({
  default: 'b001',
  SET_CURRENT_BRANCH: 'PAYLOAD'
})

const currentSmartWeek = simpleReducer({
  default: getRealCurrentSmartWeek(),
  SET_CURRENT_SMART_WEEK: 'PAYLOAD',
  ENTER_TEMPLATE_MODE: 0,
  LEAVE_TEMPLATE_MODE: getRealCurrentSmartWeek(),
})

const currentTemplate = simpleReducer({
  default: null,
  SET_CURRENT_TEMPLATE: 'PAYLOAD'
})

const templateMode = simpleReducer({
  default: false,
  ENTER_TEMPLATE_MODE: true,
  LEAVE_TEMPLATE_MODE: false,
})

export type Roster = {
  currentBranch: string,
  currentSmartWeek: number,
  currentTemplate: string,
  templateMode: boolean,
  shiftBoard: ShiftBoard
}

export default combineReducers({
  currentBranch,
  currentSmartWeek,
  currentTemplate,
  templateMode,
  shiftBoard
})
