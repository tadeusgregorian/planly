import {combineReducers} from 'redux';


const rootReducer = combineReducers({
	data: (state = 0, action) => {
		if(action.type === 'CHANGE_STATE') return action.payload
		return('dataBro')
	},
	fake: (state = 0, action) => { return('fakeBro')},
	firebaseInitialized: (state = false, action) => {
		if(action.type === 'FIREBASE_INITIALIZED') return true
		return state
	}
});

export default rootReducer
