import _ from 'lodash'

export const createFirebaseReducer_array = (target, extractor, comparer) => {
  const isSame = comparer || ((e1, e2) => e1.id === e2.id) // comparing id property by default
  const extract = extractor || ((e)=>e) // returning object without manipulation by default

	return (state = [], a) => {
		switch (a.type) {
		case 'value_received_' + target : return _.values(a.payload).map(extract)
		case 'child_added_'    + target : return [...state, extract(a.payload)]
		case 'child_changed_'  + target : return state.map(el => isSame(a.payload, el) ? extract(a.payload) : el)
		case 'child_removed_'  + target : return state.filter(el => !isSame(el, a.payload))
		case 'remove_'				 + target : return []
		default: return state;
		}
	}
}

export const createFirebaseReducer_object = (target) => {
	return (state = {}, action) => {
		switch (action.type) {
		case 'value_received_' 	+ target : return action.payload
		case 'child_added_' 		+ target : return { ...state, [action.key]: action.payload }
		case 'child_changed_' 	+ target : return { ...state, [action.key]: action.payload }
		case 'child_removed_' 	+ target : return { ...state, [action.key]: null }
		default: return state;
		}
	}
}

export const createFirebaseReducer_simple = (target) => {
	return (state = {}, action) => (
		action.type === 'value_received_'+target ? action.payload : state
	)
}

export const createDataStatusReducer = (target) => {
	return (state = 'NOT_REQUESTED', action) => {
		switch (action.type) {
		case 'data_requested_' + target : return 'REQUESTED'
		case 'value_received_' + target : return 'LOADED'
		case 'remove_'				 + target : return 'NOT_REQUESTED'
		default: return state
		}
	}
}

// this simple-reducer-creator takes an obj like {MY_ACTION_TYPE: 3232, MY_ACTION_TYPE2: 'PAYLOAD', default: 'defVal'}
// if you give a key with 'default' it will take the value of that , for example: {default: myDevaultValue} otherwise default is null.
// if there is a value 'PAYLOAD', it will assume that the action has a payload and take that, like in the example.
export const simpleReducer = (actionCases) => {
	const defaultState = actionCases.hasOwnProperty('default') ? actionCases.default : null
	return (state = defaultState , action) => {
		if (actionCases.hasOwnProperty(action.type)) {
			return (actionCases[action.type] === 'PAYLOAD' ? action.payload :  actionCases[action.type])
		} else {
			return state
		}
	}
}
