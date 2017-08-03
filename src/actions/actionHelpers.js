
// This function holds the Information, where in the FirebaseDB each Node sits
export const getFirebasePath	= (target) => {

	const accPath = 'accounts/' + window.accountID

	switch(target){
		case 'users': 					return accPath + '/users/'
		case 'branches': 				return accPath + '/branches/'
		case 'positions': 			return accPath + '/positions/'
		case 'accountDetails': 	return accPath + '/accountDetails/'
		default : throw new Error('target is not existing tade ( getFirebasePath ), target: ' + target)
	}
}
