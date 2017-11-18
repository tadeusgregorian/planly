import firebase from 'firebase'

export function signInWithEmailAndPassword (email, pw) {
	return firebase.auth().signInWithEmailAndPassword(email, pw)
}

export function logoutFromFirebase () {
  return firebase.auth().signOut()
}
