import { simpleReducer } from './reducerHelpers'
import { combineReducers } from 'redux'

const authState = simpleReducer({
	default: 								'loggedOut',
	USER_LOGGED_IN: 				'loggedIn',
	USER_LOGGED_OUT: 				'loggedOut',
	USER_IS_AUTHENTICATING: 'isAuthenticating'
})

const accountID = simpleReducer({
	SET_ACCOUNT_ID: 'PAYLOAD'
})

export default combineReducers({
	authState,
	accountID
})
