
import { getFirebasePath } from './actionHelpers'
import firebase from 'firebase'
import { db } from './firebaseInit'
import moment from 'moment'

export function deleteUser(userID) {
	const now = moment().toISOString()
	db().ref(getFirebasePath('users')).child(userID).child('deleted').set(now)
}

export function reactivateUser(userID) {
	db().ref(getFirebasePath('users')).child(userID).child('deleted').set(null)
}

export function saveUserToDB(user) {
	db().ref(getFirebasePath('users')).child(user.id).set(user)
}

export const sendEmailInvite = (userID, name, email, accountID) => {
	const inviteID = db().ref('emailInvites').push().key
	db().ref('emailInvites').child(inviteID).set({
		inviteID,
		userID,
		name,
		email,
		accountID,
		timestamp: firebase.database.ServerValue.TIMESTAMP,
		status: 'pending'
	})
}
