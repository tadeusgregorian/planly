
import { createFirebaseListener } from './firebaseHelpers'
import { getFirebasePath } from '../actionHelpers'

export const registerInitialListeners = () => (disp, getS) => {
  setAccountDetailsListener(disp, getS)
  registerUsersListener(disp, getS)
  registerPositionsListener(disp, getS)
  registerBranchesListener(disp, getS)
}

const setAccountDetailsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'accountDetails', getFirebasePath('accountDetails'), null, true)

const registerUsersListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'users', getFirebasePath('users'))

const registerPositionsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'positions', getFirebasePath('positions'))

const registerBranchesListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'branches', getFirebasePath('branches'))
