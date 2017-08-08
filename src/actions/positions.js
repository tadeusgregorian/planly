import firebase from 'firebase'
import { getFirebasePath } from './actionHelpers'

const db = () => firebase.database()

export function savePositionToDB(position) {
	db().ref(getFirebasePath('positions')).child(position.id).set(position)
}
