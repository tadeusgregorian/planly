export type FirebaseListeners = {}
// For keeping track of all listeners that are registered in Firebase. To avoid double listeners.
export default (state = {}, action) => {
	switch (action.type) {
	case 'ADD_FIREBASE_LISTENER' 		: return { ...state, [action.listenerTarget]: action.listenerPath }
	case 'REMOVE_FIREBASE_LISTENER' : return { ...state, [action.listenerTarget]: null }
	default: return state;
	}
}
