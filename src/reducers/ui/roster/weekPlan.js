//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import type { ShiftCell } from 'types/index'

type FocusedCell = null | ShiftCell
const focusedCell = simpleReducer({
  default              : null,
  FOCUS_SHIFT_CELL     : 'PAYLOAD',
  UNFOCUS_SHIFT_CELL   : null,
  remove_shiftWeek     : null,
})

type OptionsExpanded = boolean
const optionsExpanded = (state = false, a) => {
  if(a.type === 'TOGGLE_POPOVER_OPTIONS') return !state
  if(a.type === 'UNFOCUS_SHIFT_CELL') return false
  return false
}

export type WeekPlan = {
  focusedCell: FocusedCell,
  optionsExpanded: OptionsExpanded
}

export default combineReducers({
  focusedCell,
  optionsExpanded
})
