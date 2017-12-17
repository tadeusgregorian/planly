//@flow
import firebase from 'firebase'
import { trackFBListeners } from './firebaseHelpers'
import { checkClientDate } from '../clientDateCheck'
import { logOut } from 'actions/auth'
import { createCookie, deleteCookie } from 'helpers/cookies';
import { getDomain } from 'configs/index'
import type { GetState } from 'types/index'


export const setAuthStateListener = (initializor: Function) => (dispatch: Dispatch, getState: GetState) => {

  trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
  dispatch({type: 'USER_IS_AUTHENTICATING'})

  firebase.auth().onAuthStateChanged((user) => {

    if (!user) {
      deleteCookie('loggedIn', getDomain())
      return dispatch(logOut())
    }

    const _user = firebase.database().ref('allUsers/' + user.uid).once('value')


    Promise.all([_user]).then(results => {

      const user = results[0].val()


      if(!user || user.deleted) return dispatch(logOut())

      createCookie('loggedIn', 'true', getDomain(), 1000)

      dispatch({type: 'USER_LOGGED_IN' })
      dispatch({type: 'SET_ACCOUNT_ID',       payload: user.account})
      dispatch({type: 'SET_CURRENT_USER_ID',  payload: user.userID})

      window.accountID = user.account // this is little hacky.. so helper function can have access to accountID without getState()
      checkClientDate(dispatch)
      initializor()
    })
  })
}
