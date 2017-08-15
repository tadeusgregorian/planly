import { combineReducers } from 'redux'
import { simpleReducer } from '../../reducerHelpers'
import { getRealCurrentSmartWeek } from 'helpers/index'
import weekPlan from './weekPlan'

const currentBranch = simpleReducer({
  default: 'b001',
  SET_CURRENT_BRANCH: 'PAYLOAD'
})

const currentSmartWeek = simpleReducer({
  default: getRealCurrentSmartWeek(),
  SET_CURRENT_SMART_WEEK: 'PAYLOAD'
})

export default combineReducers({
  currentBranch,
  currentSmartWeek,
  weekPlan
})
