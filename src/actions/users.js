//@flow
import { getFBPath } from './actionHelpers'
import firebase from 'firebase'
import { db } from './firebaseInit'
import type { User } from 'types/index'
import moment from 'moment'

export function deleteUser(userID: string) {
	const now = moment().toISOString()
	db().ref(getFBPath('users')).child(userID).child('deleted').set(now)
}

export function reactivateUser(userID: string) {
	db().ref(getFBPath('users')).child(userID).child('deleted').set(null)
}

export function saveUserToDB(user: User) {
	db().ref(getFBPath('users')).child(user.id).set(user)
}

export const sendEmailInvite = (userID: string, name: string, email: string, accountID: string) => {
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
