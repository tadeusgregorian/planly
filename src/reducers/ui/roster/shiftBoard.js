//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import type { ShiftRef } from 'types/index'

const focusedShiftRef = simpleReducer({
  default              : null,
  FOCUS_SHIFT          : 'PAYLOAD',
  UNFOCUS_SHIFT        : null,
  SET_TEMPLATE_MODE    : null,
  remove_shiftWeek     : null,
})

const nonWorkersHidden = simpleReducer({
  default              : false,
  HIDE_NON_WORKES      : 'PAYLOAD',
  SET_TEMPLATE_MODE    : false,
  remove_shiftWeek     : false,
})

const timeDetailsVisible = (state = true, a) => {  // @TODO set default to false again 
  if(a.type === 'TOGGLE_SHIFTBOARD_TIME_DETAILS') return !state
  return state
}

type OptionsExpanded = boolean
const optionsExpanded = (state = false, a) => {
  if(a.type === 'TOGGLE_POPOVER_OPTIONS') return !state
  if(a.type === 'UNFOCUS_SHIFT_CELL') return false
  return state
}

export type ShiftBoard = {
  focusedShiftRef: ?ShiftRef,
  optionsExpanded: OptionsExpanded,
  nonWorkersHidden: boolean,
  timeDetailsVisible: boolean,
}

export default combineReducers({
  focusedShiftRef,
  optionsExpanded,
  nonWorkersHidden,
  timeDetailsVisible
})
