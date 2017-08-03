import { simpleReducer } from './reducerHelpers'
import { combineReducers } from 'redux'

export const authState = simpleReducer({
	default: 								'loggedOut',
	USER_LOGGED_IN: 				'loggedIn',
	USER_LOGGED_OUT: 				'loggedOut',
	USER_IS_AUTHENTICATING: 'isAuthenticating'
})

export default combineReducers({
	authState
})
