//@flow
import { getFBPath } from './actionHelpers'
import { db } from './firebaseInit'
import { generateGuid } from 'helpers/index'
import { changeCurrentBranch } from 'actions/ui/roster'
import type { GetState, Branch } from 'types/index'

export function saveBranchToDB(branch: Branch, creation: boolean = false) {
	const updates = {}

	updates[getFBPath('branches') + branch.id] = branch

	if(creation) {
		// whenever a new branch is created, we create also the inital flatTemplate!
		const defaultTempID = generateGuid()
		const templateFlat = { id: defaultTempID, name: 'Musterwoche 1', branch: branch.id }
		updates[getFBPath('templatesFlat') + defaultTempID] = templateFlat
	}

	db().ref().update(updates)
}

export const deleteBranch = (branchID: string) => (dispatch: Dispatch, getState: GetState): Promise<any> => {
	if(branchID === getState().ui.roster.currentBranch){ // if were deleting currentBranch -> jumpt to another one
		const jumpToBranch: Branch = (getState().core.branches.find(b => b.id !== branchID): any)
		dispatch(changeCurrentBranch(jumpToBranch.id))
	}

	return db().ref(getFBPath('branches', [branchID, 'deleted'])).set(true)
}
