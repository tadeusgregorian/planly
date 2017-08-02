import firebase from 'firebase'

const addFBListener = (ref, fbAction, target, dispatch, childrenCount = 0) => {
	let childrenAdded = 0
	ref.on(fbAction, snapshot => {
		// this is a workaround because Firebase fires initial child_added events even though we have already done once(value)
		if(fbAction === 'child_added' && childrenAdded < childrenCount) { childrenAdded++; return }
		dispatch({ type: fbAction + '_' + target, payload: snapshot.val(), key: snapshot.key })
	})
}

export const trackFBListeners = (dispatch, getState, listenerTarget, newPath) => {
	const listenerPath = getState().firebaseListeners[listenerTarget]
	if(listenerPath) firebase.database().ref(listenerPath).off()
	dispatch({type: 'ADD_FIREBASE_LISTENER', listenerTarget: listenerTarget, listenerPath: newPath})
}

// optionally you can give queryRef instead of dbPath to make a firebaseQuery beforehand.
// the onValue is used for Listeners that just want to sync with a DB value. no child Events needed
export const createFirebaseListener = (dispatch, getState, target, dbPath, queryRef = null, onValue = false) => {
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
