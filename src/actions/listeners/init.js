
import { createFirebaseListener } from './firebaseHelpers'
import { getFBPath } from '../actionHelpers'

export const registerInitialListeners = () => (disp, getS) => {
  setAccountDetailsListener(disp, getS)
  registerUsersListener(disp, getS)
  registerPositionsListener(disp, getS)
  registerBranchesListener(disp, getS)
}

const setAccountDetailsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'accountDetails', getFBPath('accountDetails'))

const registerUsersListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'users', getFBPath('users'))

const registerPositionsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'positions', getFBPath('positions'))

const registerBranchesListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'branches', getFBPath('branches'))
