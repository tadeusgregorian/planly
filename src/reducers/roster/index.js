import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'
import _ from 'lodash'

// we extract this because there is userDay, and branchDay in DB ( just needed for mobile )
const extractNeeded = (data) => {
  const { s, e, b, user, day, isOpen, position } = data
  return { s, e, b, user, day, isOpen, position }
}

const sameShift = (s1, s2) => s1.user === s2.user && s1.day === s2.day

const shiftWeekReducer = (state = [], a) => {
  switch(a.type) {
		case 'value_received_shiftWeek' : return _.values(a.payload).map(data => extractNeeded(data))
    case 'child_added_shiftWeek'    : return [ ...state, extractNeeded(a.payload) ]
    case 'child_changed_shiftWeek'  : return state.map(shift => sameShift(shift, a.payload) ? a.payload : shift )
    case 'child_removed_shiftWeek'  : return state.filter(shift => !sameShift(shift, a.payload))
    case 'remove_shiftWeek'				  : return []
    default: return state
  }
}

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  shiftWeek: shiftWeekReducer,
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek')
})
