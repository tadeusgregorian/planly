//@flow

// This function holds the Information, where in the FirebaseDB each Node sits
export const getFirebasePath	= (target: string): string => {

	const accPath = 'accounts/' + window.accountID

	switch(target){
		case 'users': 					return accPath + '/users/'
		case 'branches': 				return accPath + '/branches/'
		case 'positions': 			return accPath + '/positions/'
		case 'accountDetails': 	return accPath + '/accountDetails/'
		case 'queues': 					return accPath + '/queues/'
		case 'roster': 					return accPath + '/roster/'
		case 'shiftWeeks': 			return accPath + '/roster/shiftWeeks/'
		case 'notes': 					return accPath + '/roster/notes/'
		default : throw new Error('target is not existing tade ( getFirebasePath ), target: ' + target)
	}
}
