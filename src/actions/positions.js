import { getFirebasePath } from './actionHelpers'
import { db } from './firebaseInit'

export function savePositionToDB(position) {
	db().ref(getFirebasePath('positions')).child(position.id).set(position)
}
