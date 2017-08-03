import firebase from 'firebase'

export const checkClientDate = () => (dispatch) => {
	firebase.database().ref(".info/serverTimeOffset").once('value', snap => {
		const offsetTooBig = Math.abs(snap.val()) > (1000 * 60 * 60 * 3) // if difference to real time is less than 3 hours

		offsetTooBig ? dispatch({type: 'CLIENT_DATE_INCORRECT'}) : dispatch({type: 'CLIENT_DATE_CORRECT'})
	})
}
