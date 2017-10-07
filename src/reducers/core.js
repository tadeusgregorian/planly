//@flow
import { createDataStatusReducer, createFirebaseReducer_array, createFirebaseReducer_object} from './reducerHelpers'
import { combineReducers } from 'redux'
import type { Users, Positions, Branches, DataStatus, AccountDetails } from 'types/index'

const coreReducer =  combineReducers({
  users: createFirebaseReducer_array('users'),
  positions: createFirebaseReducer_array('positions'),
  branches: createFirebaseReducer_array('branches'),
  accountDetails: createFirebaseReducer_object('accountDetails'),

  usersDataStatus: createDataStatusReducer('users'),
  positionsDataStatus: createDataStatusReducer('positions'),
  branchesDataStatus: createDataStatusReducer('branches'),
  accountDetailsDataStatus: createDataStatusReducer('accountDetails'),
})

export type Core = {
  users: Users,
  positions: Positions,
  branches: Branches,
  accountDetails: AccountDetails,
  usersDataStatus: DataStatus,
  positionsDataStatus: DataStatus,
  branchesDataStatus: DataStatus,
  accountDetailsDataStatus: DataStatus,
}

export default coreReducer
