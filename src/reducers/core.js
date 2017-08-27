//@flow
import { createDataStatusReducer, createFirebaseReducer_array} from './reducerHelpers'
import { combineReducers } from 'redux'
import type { Users, Positions, Branches, DataStatus } from 'types/index'

const coreReducer =  combineReducers({
  users: createFirebaseReducer_array('users'),
  positions: createFirebaseReducer_array('positions'),
  branches: createFirebaseReducer_array('branches'),

  usersDataStatus: createDataStatusReducer('users'),
  positionsDataStatus: createDataStatusReducer('positions'),
  branchesDataStatus: createDataStatusReducer('branches'),
})

export type Core = {
  users: Users,
  positions: Positions,
  branches: Branches,
  usersDataStatus: DataStatus,
  positionsDataStatus: DataStatus,
  branchesDataStatus: DataStatus,
}

export default coreReducer
