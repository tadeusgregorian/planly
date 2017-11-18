//@flow

import {combineReducers} from 'redux';
import {simpleReducer} from './reducerHelpers';
import auth from './auth'
import core from './core'
import firebaseListeners from './firebaseListeners'
import ui from './ui'
import roster from './roster'
import type { Roster } from './roster'
import type { Ui } from './ui'
import type { Auth } from './auth'
import type { Core } from './core'
import type { FirebaseListeners } from './firebaseListeners'

export type RootReducer = {
	firebaseInitialized: null | true,
	core: Core,
	auth: Auth,
	firebaseListeners: FirebaseListeners,
	ui: Ui,
	roster: Roster,
}

const rootReducer = combineReducers({
	firebaseInitialized: simpleReducer({'FIREBASE_INITIALIZED': true}),
	core,
	auth,
	firebaseListeners,
	ui,
	roster,
});

export default rootReducer
