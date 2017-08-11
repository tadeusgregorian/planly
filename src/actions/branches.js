import firebase from 'firebase'
import { getFirebasePath } from './actionHelpers'

const db = () => firebase.database()

export function saveBranchToDB(branch) {
	db().ref(getFirebasePath('branches')).child(branch.id).set(branch)
}
