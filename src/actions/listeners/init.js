
import { createFirebaseListener } from './firebaseHelpers'
import { setRequestedAbsencesListener } from './absencePlaner'
import { setShiftEditsListener } from './roster'
import { getFBPath } from '../actionHelpers'

export const registerInitialListeners = () => (disp, getS) => {
  setAccountDetailsListener(disp, getS)
  registerUsersListener(disp, getS)
  registerPositionsListener(disp, getS)
  registerBranchesListener(disp, getS)

  // these are being loaded -> to be able to show Notifications-Count in Topbar
  setShiftEditsListener(disp, getS)
  setRequestedAbsencesListener(disp, getS)
}

const setAccountDetailsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'accountDetails', getFBPath('accountDetails'))

const registerUsersListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'users', getFBPath('users'))

const registerPositionsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'positions', getFBPath('positions'))

const registerBranchesListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'branches', getFBPath('branches'))
