import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'

const focusedCell = simpleReducer({
  default              : null,
  FOCUS_SHIFT_CELL     : 'PAYLOAD',
  UNFOCUS_SHIFT_CELL   : null,
  remove_shiftWeek     : null,
})


export default combineReducers({
  focusedCell
})
