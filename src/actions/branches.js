import { getFirebasePath } from './actionHelpers'
import { db } from './firebaseInit'

export function saveBranchToDB(branch) {
	db().ref(getFirebasePath('branches')).child(branch.id).set(branch)
}
