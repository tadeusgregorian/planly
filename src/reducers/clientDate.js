import { combineReducers } from 'redux'
import { simpleReducer } from './reducerHelpers'

type ClientDateCorrect = null | true | false
const clientDateCorrect = simpleReducer({
	default: 										null,
	CLIENT_DATE_CORRECT: 				true,
	CLIENT_DATE_INCORRECT: 			false,
})

type ClientDateChecked = boolean
const clientDateChecked = simpleReducer({
	default: 										false,
	CLIENT_DATE_CORRECT: 				true,
	CLIENT_DATE_INCORRECT: 			true,
})

export type ClientDate = {
	clientDateCorrect: ClientDateCorrect,
	clientDateChecked: ClientDateChecked
}
export default combineReducers({
	clientDateCorrect,
	clientDateChecked
})
