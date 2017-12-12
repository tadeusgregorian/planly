//@flow

import {combineReducers} from 'redux';
import {simpleReducer} from './reducerHelpers';
import auth from './auth'
import core from './core'
import clientDate from './clientDate'
import firebaseListeners from './firebaseListeners'
import ui from './ui'
import roster from './roster'
import absencePlaner from './absencePlaner'
import dbVersion from './dbVersion'
import type { Roster } from './roster'
import type { AbsencePlaner } from './absencePlaner'
import type { Ui } from './ui'
import type { Auth } from './auth'
import type { ClientDate } from './clientDate'
import type { Core } from './core'
import type { FirebaseListeners } from './firebaseListeners'

export type RootReducer = {
	firebaseInitialized: null | true,
	core: Core,
	auth: Auth,
	clientDate: ClientDate,
	firebaseListeners: FirebaseListeners,
	ui: Ui,
	roster: Roster,
	absencePlaner: AbsencePlaner,
	dbVersion: number | string | void,
}

const appReducer = combineReducers({
	firebaseInitialized: simpleReducer({'FIREBASE_INITIALIZED': true}),
	core,
	auth,
	clientDate,
	firebaseListeners,
	ui,
	roster,
	absencePlaner,
	dbVersion
})

// this is to get a clean Store after logout
const rootReducer = (state: any, action: {}) => {
  if (action.type === 'USER_LOGGED_OUT') {
    state = undefined
  }
  return appReducer(state, action)
}

// const rootReducer = combineReducers({
// 	firebaseInitialized: simpleReducer({'FIREBASE_INITIALIZED': true}),
// 	core,
// 	auth,
// 	clientDate,
// 	firebaseListeners,
// 	ui,
// 	roster,
// 	absencePlaner,
// });

export default rootReducer
