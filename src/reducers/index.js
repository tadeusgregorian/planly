//@flow

import {combineReducers} from 'redux';
import {simpleReducer} from './reducerHelpers';
import auth from './auth'
import core from './core'
import clientDate from './clientDate'
import firebaseListeners from './firebaseListeners'
import ui from './ui'
import roster from './roster'


const rootReducer = combineReducers({
	firebaseInitialized: simpleReducer({'FIREBASE_INITIALIZED': true}),
	core,
	auth,
	clientDate,
	firebaseListeners,
	ui,
	roster
});

export default rootReducer
