//@flow
import { getFBPath } from './actionHelpers'
import firebase from 'firebase'
import { getAppUrl, isProduction } from 'configs/index'
import { db } from './firebaseInit'
import type { User } from 'types/index'
import moment from 'moment'

export function deleteUser(userID: string) {
	const smartDateToday = parseInt(moment().format('YYYYMMDD'), 10)

	return db().ref('/allUsers').orderByChild('userID').equalTo(userID).once('value')
		.then((snap) => {
      const activated = !!snap.val() // the user might not be existing in allUsers ( if not activated yet )
      const updates = {}

      // we get an object with key-value pairs as snap-value -> thats why conversion to array...
      // -> we cant do a firebase 'child_added' to get the data nice and clean
      // because the promise doesnt resolve if query result is empty...
			const firebaseUserID = activated && Object.keys(snap.val())[0]

			if (activated) updates[`/allUsers/${firebaseUserID}/deleted`] = smartDateToday
			updates[getFBPath('users', [userID, 'deleted'])] = smartDateToday

			return db().ref().update(updates)
		})
    .catch(e => console.log(e))
}

// export function reactivateUser(userID: string) {
// 	db().ref(getFBPath('users')).child(userID).child('deleted').set(null)
// }

export function saveUserToDB(user: User) {
	db().ref(getFBPath('users')).child(user.id).set(user)
}

// this is being called by user himself in his userProfile view
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
	updates[ getFBPath('users', [ userID, 'email' ]) ] = email
	updates['emailInvites/' + key] = inviteObj

	db().ref().update(updates)
}
