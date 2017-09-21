//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import { getRealCurrentWeekID } from 'helpers/index'
import shiftBoard from './shiftBoard'
import type { ShiftBoard } from './shiftBoard'

const currentBranch = simpleReducer({
  default: 'b001',
  SET_CURRENT_BRANCH: 'PAYLOAD'
})

// sorry hacky: when entering TemplateMode we set currentWeekID to the branchID
// ( because there is always the default template with a weekID equal to the branchID )
const currentWeekID = simpleReducer({
  default: getRealCurrentWeekID(),
  SET_CURRENT_WEEK_ID: 'PAYLOAD',
  ENTER_TEMPLATE_MODE: 0,
  LEAVE_TEMPLATE_MODE: getRealCurrentWeekID(),
})


const templateMode = simpleReducer({
  default: false,
  ENTER_TEMPLATE_MODE: true,
  LEAVE_TEMPLATE_MODE: false,
})

export type Roster = {
  currentBranch: string,
  currentWeekID: string,
  currentTemplate: string,
  templateMode: boolean,
  shiftBoard: ShiftBoard
}

export default combineReducers({
  currentBranch,
  currentWeekID,
  templateMode,
  shiftBoard
})
