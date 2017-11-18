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

type JobData = {userID: string, email: string, name: string, accountID:string, url: string}
export const addInvitationJob = ({ userID, email, name, accountID, url }: JobData) => {
	console.log('Doing This ???');
	const key = db().ref('emailInvites').push().key
	db().ref('emailInvites').child(key).set({
		userID,
		email,
		name,
		accountID,
		url,
		status: 'PENDING',
		timestamp: firebase.database.ServerValue.TIMESTAMP })
}
