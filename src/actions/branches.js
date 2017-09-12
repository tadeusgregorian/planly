import { getFirebasePath } from './actionHelpers'
import { db } from './firebaseInit'

export function saveBranchToDB(branch) {
	// whenever a new branch is created, we create also the inital flatTemplate
	const templateFlat = { id: branch.id, name: 'unbenannt', branch: branch.id }
	const updates = {
		[getFirebasePath('branches') + branch.id]: branch,
		[getFirebasePath('templatesFlat') + branch.id]: templateFlat
	}
	db().ref().update(updates)
}
