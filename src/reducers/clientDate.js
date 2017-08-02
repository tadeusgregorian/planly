import { combineReducers } from 'redux'
import { simpleReducer } from './reducerHelpers'

const clientDateCorrect = simpleReducer({
	default: 										null,
	CLIENT_DATE_CORRECT: 				true,
	CLIENT_DATE_INCORRECT: 			false,
})

const clientDateChecked = simpleReducer({
	default: 										false,
	CLIENT_DATE_CORRECT: 				true,
	CLIENT_DATE_INCORRECT: 			true,
})

export default combineReducers({
	clientDateCorrect,
	clientDateChecked
})
