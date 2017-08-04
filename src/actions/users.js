import firebase from 'firebase'
import { getFirebasePath } from './actionHelpers'
import moment from 'moment'

export function deleteUser(userID) {
	const now = moment().toISOString()
	firebase.database().ref(getFirebasePath('users')).child(userID).child('deleted').set(now)
}

export function reactivateUser(userID) {
	firebase.database().ref(getFirebasePath('users')).child(userID).child('deleted').set(null)
}

export function saveUserToDB(user) {
	firebase.database().ref(getFirebasePath('users')).child(user.id).set(user)
}
