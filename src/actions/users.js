import firebase from 'firebase'
import { getFirebasePath } from './actionHelpers'
import moment from 'moment'

const db = () => firebase.database()

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
