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

type OptionsExpanded = boolean
const optionsExpanded = (state = false, a) => {
  if(a.type === 'TOGGLE_POPOVER_OPTIONS') return !state
  if(a.type === 'UNFOCUS_SHIFT_CELL') return false
  return false
}

export type ShiftBoard = {
  focusedShiftRef: ?ShiftRef,
  optionsExpanded: OptionsExpanded
}

export default combineReducers({
  focusedShiftRef,
  optionsExpanded
})
