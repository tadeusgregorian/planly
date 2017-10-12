import { getFBPath } from './actionHelpers'
import { db } from './firebaseInit'

export function saveBranchToDB(branch) {
	// whenever a new branch is created, we create also the inital flatTemplate
	const defaultTempID = 'defaultTemplate_' + branch.id
	const templateFlat = { id: defaultTempID, name: 'unbenannt', branch: branch.id }
	const updates = {
		[getFBPath('branches') + branch.id]: branch,
		[getFBPath('templatesFlat') + defaultTempID]: templateFlat
	}
	db().ref().update(updates)
}
