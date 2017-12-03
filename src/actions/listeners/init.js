//@flow
import { db } from 'actions/firebaseInit'
import { createFirebaseListener } from './firebaseHelpers'
import { setRequestedAbsencesListener } from './absencePlaner'
import { setShiftEditsListener } from './roster'
import { getFBPath } from '../actionHelpers'
import type { GetState } from 'types/index'

export const registerInitialListeners = () => (disp: Dispatch, getS: GetState) => {
  setDbVersionListener(disp,getS)
  setAccountDetailsListener(disp, getS)
  registerUsersListener(disp, getS)
  registerPositionsListener(disp, getS)
  registerBranchesListener(disp, getS)

  // these are being loaded -> to be able to show Notifications-Count in Topbar
  setShiftEditsListener(disp, getS)
  setRequestedAbsencesListener(disp, getS)
}

const setDbVersionListener = (disp, GetS) =>
  db().ref('/dbVersion').on('value', snap => {
    disp({ type: 'value_received_dbVersion', payload: snap.val() })
  })

const setAccountDetailsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'accountDetails', getFBPath('accountDetails'))

const registerUsersListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'users', getFBPath('users'))

const registerPositionsListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'positions', getFBPath('positions'))

const registerBranchesListener = (disp, getS) =>
	createFirebaseListener(disp, getS, 'branches', getFBPath('branches'))
