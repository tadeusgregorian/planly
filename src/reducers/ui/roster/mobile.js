//@flow
import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'

type FocusedShiftMobile = string | null
const focusedShift = simpleReducer({
  default              : null,
  FOCUS_SHIFT_MOB      : 'PAYLOAD',
  UNFOCUS_SHIFT_MOB    : null,
})

export type Mobile = {
  focusedShift: FocusedShiftMobile
}

export default combineReducers({
  focusedShift
})
