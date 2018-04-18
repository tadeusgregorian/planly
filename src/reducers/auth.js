//@flow
import { simpleReducer } from './reducerHelpers'
import { combineReducers } from 'redux'
import type { AuthState } from 'types/index'

const authState = simpleReducer({
	default: 								'isAuthenticating',
	USER_LOGGED_IN: 				'loggedIn',
	USER_LOGGED_OUT: 				'loggedOut',
	USER_IS_AUTHENTICATING: 'isAuthenticating',
	AUTH_FAILED: 						'loggedOut',
})

type AccountID = string | null
const accountID = simpleReducer({
	SET_ACCOUNT_ID: 'PAYLOAD'
})

type CurrentUserID = string | null
const currentUserID = simpleReducer({
	SET_CURRENT_USER_ID: 'PAYLOAD'
})

type ClientDevice = 'DESKTOP' | 'MOBILE'
const clientDevice = simpleReducer({
  default:              'DESKTOP',
	SET_CLIENT_TO_MOBILE: 'MOBILE'
})

export type Auth = {
	authState: AuthState,
	accountID: AccountID,
	currentUserID: CurrentUserID,
  clientDevice: ClientDevice
}

export default combineReducers({
	authState,
	accountID,
	currentUserID,
  clientDevice
})
