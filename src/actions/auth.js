//@flow
import firebase from 'firebase'
import { Toast } from 'helpers/iziToast'

export const createUserWithEmailAndPassword = (email: string, password: string) => {
	return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export function signInWithEmailAndPassword (email: string, pw: string) {
	return firebase.auth().signInWithEmailAndPassword(email, pw)
}

export const logOut = (text?: string) => (dispatch: Dispatch) => {
  text && Toast.warning(text)
	console.log('TADE IM HERE');
  firebase.auth().signOut()
	dispatch({ type: 'USER_LOGGED_OUT' })
}

export function checkIfEmailExists (email: string) {
 //TODO finish this
}

export function sendPasswordResetEmail (email: string) {
  firebase.auth().sendPasswordResetEmail(email)
}
