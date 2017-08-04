import { createSelector } from 'reselect'

const getUsersDS 			= (state) => state.core.usersDataStatus
const getPositionsDS 	= (state) => state.core.positionsDataStatus
const getBranchesDS		= (state) => state.core.branchesDataStatus

// returns TRUE if all DataStatuses are 'LOADED', else returns FALSE
const allLoaded = (usersDS, positionsDS, branchesDS) => {

	const dataStatuses = [usersDS, positionsDS, branchesDS]
	return dataStatuses.reduce((acc, curr) => (curr !== 'LOADED' ? false : acc), true)
}

export default createSelector([getUsersDS, getPositionsDS, getBranchesDS], allLoaded)
