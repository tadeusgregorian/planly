import { getFBPath } from './actionHelpers'
import { db } from './firebaseInit'

export function savePositionToDB(position) {
	db().ref(getFBPath('positions')).child(position.id).set(position)
}
