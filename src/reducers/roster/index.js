//@flow
import { deletePropAndReturnObj } from 'helpers/index'
import { createDataStatusReducer } from '../reducerHelpers'
import { combineReducers } from 'redux'
import _ from 'lodash'

const shiftWeekReducer = (state = {}, a) => {
  switch(a.type) {
		case 'value_received_shiftWeek' : return _.values(a.payload).reduce((acc, val)=> ({ ...acc, [val.uid]: val.days }), {})
    case 'child_added_shiftWeek'    : return { ...state, [a.payload.uid]: a.payload.day }
    case 'child_changed_shiftWeek'  : return { ...state, [a.payload.uid]: a.payload.day }
    case 'child_removed_shiftWeek'  : return deletePropAndReturnObj(state, a.payload.uid)
    case 'remove_shiftWeek'				  : return {}
    default: return state
  }
}

export default combineReducers({
  shiftWeek: shiftWeekReducer,
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek')
})
