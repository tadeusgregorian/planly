//@flow

import firebase from 'firebase'
import type { Dispatch } from 'types/index'

type cFbLType = (disp: Dispatch, getS: ()=>any, t: string, dbP: string, qR?: ?any, oV?: ?boolean ) => any
type trackFbLType = (disp: Dispatch, getS: ()=>any, lT:string, nP: string) => any

const addFBListener = (ref, fbAction, target, dispatch, childrenCount = 0) => {
	let childrenAdded = 0
	ref.on(fbAction, snapshot => {
		// this is a workaround because Firebase fires initial child_added events even though we have already done once(value)
		if(fbAction === 'child_added' && childrenAdded < childrenCount) { childrenAdded++; return }
		dispatch({ type: fbAction + '_' + target, payload: snapshot.val(), key: snapshot.key })
	})
}

//on every listenerTarget there is only one lister active ( previous listeners get removed )
export const trackFBListeners: trackFbLType = (dispatch, getState, listenerTarget, newPath) => {
	const prevListenerPath = getState().firebaseListeners[listenerTarget]
	if(prevListenerPath) firebase.database().ref(prevListenerPath).off()
	dispatch({type: 'ADD_FIREBASE_LISTENER', listenerTarget: listenerTarget, listenerPath: newPath})
}

// optionally you can give queryRef additionally to a dbPath to make a firebaseQuery beforehand.
// the dbPath is still needed, for the trackFBListeners-function.
// the onValue is used for Listeners that just want to sync with a DB value. no child Events needed
export const createFirebaseListener:cFbLType  = (dispatch, getState, target, dbPath, queryRef = null, onValue = false) => {
	return new Promise((resolve, reject) => {

		trackFBListeners(dispatch, getState, target, dbPath)
		dispatch({type: 'data_requested_' + target })
		const ref = queryRef || firebase.database().ref(dbPath)

		ref[onValue ? 'on' : 'once']('value', snap => {
			dispatch({ type: 'value_received_' + target, payload: snap.val() })
			resolve(snap.val())
			if(onValue) return // if we listen for 'on' events, we dont need to listen to children

			const childrenCount = snap.exists() ? Object.keys(snap.val()).length : 0
			addFBListener(ref, 'child_changed', target, dispatch)
			addFBListener(ref, 'child_added', 	target, dispatch, childrenCount)
			addFBListener(ref, 'child_removed', target, dispatch)
		},
		e => console.log(e.message))
	})
}
