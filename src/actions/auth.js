import firebase from 'firebase'

export const createUserWithEmailAndPassword = (email, password) => {
	return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export function signInWithEmailAndPassword (email, pw) {
	return firebase.auth().signInWithEmailAndPassword(email, pw)
}

export function logoutFromFirebase () {
  firebase.auth().signOut()
}

export function checkIfEmailExists (email) {
 //TODO finish this
}

export function sendPasswordResetEmail (email) {
  firebase.auth().sendPasswordResetEmail(email)
}
