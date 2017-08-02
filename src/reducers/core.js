import { createDataStatusReducer, createFirebaseReducer_array} from './reducerHelpers'
import { combineReducers } from 'redux'

export default combineReducers({
  users: createFirebaseReducer_array('users'),
  positions: createFirebaseReducer_array('positions'),
  branches: createFirebaseReducer_array('branches'),
  
  usersDataStatus: createDataStatusReducer('users'),
  positionsDataStatus: createDataStatusReducer('positions'),
  branchesDataStatus: createDataStatusReducer('branches'),
})
