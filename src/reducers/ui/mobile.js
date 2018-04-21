//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../reducerHelpers'
import type { SnackNoteMob } from 'types/index'

type FocusedShiftMobile = string | null
const focusedShift = simpleReducer({
  default              : null,
  FOCUS_SHIFT_MOB      : 'PAYLOAD',
  UNFOCUS_SHIFT_MOB    : null,
})

const snackNote = simpleReducer({
  OPEN_SNACK_BAR_MOB: 'PAYLOAD',
  CLOSE_SNACK_BAR_MOB: null
})

export type Mobile = {
  focusedShift: FocusedShiftMobile,
  snackNote: SnackNoteMob
}

export default combineReducers({
  focusedShift,
  snackNote
})
