//@flow
import firebase from 'firebase'

export const createUserWithEmailAndPassword = (email: string, password: string) => {
	return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export function signInWithEmailAndPassword (email: string, pw: string) {
	return firebase.auth().signInWithEmailAndPassword(email, pw)
}

export function logoutFromFirebase () {
  firebase.auth().signOut()
}

export function checkIfEmailExists (email: string) {
 //TODO finish this
}

export function sendPasswordResetEmail (email: string) {
  firebase.auth().sendPasswordResetEmail(email)
}
