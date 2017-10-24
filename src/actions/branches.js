import { getFBPath } from './actionHelpers'
import { db } from './firebaseInit'
import { generateGuid } from 'helpers/index'

export function saveBranchToDB(branch) {
	// whenever a new branch is created, we create also the inital flatTemplate!
	const defaultTempID = generateGuid()
	const templateFlat = { id: defaultTempID, name: 'Musterwoche 1', branch: branch.id }
	const updates = {
		[getFBPath('branches') + branch.id]: branch,
		[getFBPath('templatesFlat') + defaultTempID]: templateFlat
	}
	db().ref().update(updates)
}
