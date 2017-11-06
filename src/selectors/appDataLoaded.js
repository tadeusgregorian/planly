//@flow
import { createSelector } from 'reselect'
import type { Store } from 'types/index'

const getUsersDS 					= (state: Store) => state.core.usersDataStatus
const getPositionsDS 			= (state: Store) => state.core.positionsDataStatus
const getBranchesDS				= (state: Store) => state.core.branchesDataStatus
const getAccoutDetailsDS 	= (state: Store) => state.core.accountDetailsDataStatus



// returns TRUE if all DataStatuses are 'LOADED', else returns FALSE
const allLoaded = (usersDS, positionsDS, branchesDS, accoutDetailsDS): boolean => {

	const dataStatuses = [usersDS, positionsDS, branchesDS, accoutDetailsDS]
	return dataStatuses.reduce((acc, curr) => (curr !== 'LOADED' ? false : acc), true)
}

export default createSelector([getUsersDS, getPositionsDS, getBranchesDS, getAccoutDetailsDS], allLoaded)
