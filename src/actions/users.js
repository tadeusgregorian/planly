//@flow
import { getFBPath } from './actionHelpers'
import firebase from 'firebase'
import { getAppUrl, isProduction } from 'configs/index'
import { db } from './firebaseInit'
import type { User } from 'types/index'
import moment from 'moment'

export function deleteUser(userID: string) {
	const smartDateToday = parseInt(moment().format('YYYYMMDD'), 10)

	return db().ref('/allUsers').orderByChild('userID').equalTo(userID).once('child_added')
		.then((snap) => {
			const firebaseUserID = snap.key

			const updates = {}
			updates[`/allUsers/${firebaseUserID}/deleted`] = smartDateToday
			updates[getFBPath('users', [userID, 'deleted'])] = smartDateToday

			return db().ref().update(updates)
		})
}

// export function reactivateUser(userID: string) {
// 	db().ref(getFBPath('users')).child(userID).child('deleted').set(null)
// }

export function saveUserToDB(user: User) {
	db().ref(getFBPath('users')).child(user.id).set(user)
}

export function updateUserEmail(userID: string, firebaseUID: string, email: string): Promise<any> {
	const updates = {
		[getFBPath('users', [userID, 'email'])]: email,
		[`/allUsers/${firebaseUID}/email`]: email
	}
	return db().ref().update(updates)
}

type JobData = {userID: string, email: string, name: string, accountID:string}
export const addInvitationJob = ({ userID, email, name, accountID }: JobData) => {

	const _email = isProduction() ? email : 'arm.gregorian@hotmail.de'

	const key = db().ref('emailInvites').push().key
	const inviteObj = {
		userID,
		email: _email,
		name,
		accountID,
		url: getAppUrl(),
		status: 'PENDING',
		timestamp: firebase.database.ServerValue.TIMESTAMP
	}

	const updates = {}
	updates[ getFBPath('users', [ userID, 'status' ]) ] = 'INVITED'
	updates['emailInvites/' + key] = inviteObj

	db().ref().update(updates)
}
