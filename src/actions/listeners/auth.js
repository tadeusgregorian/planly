//@flow
import firebase from 'firebase'
import { trackFBListeners } from './firebaseHelpers'
import { checkClientDate } from '../clientDateCheck'
import { createCookie, deleteCookie } from './localHelpers';
import { getDomain } from 'configs/index'
import type { GetState } from 'types/index'


export const setAuthStateListener = (initializor: Function) => {
  return (dispatch: Dispatch, getState: GetState) => {

    trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
    dispatch({type: 'USER_IS_AUTHENTICATING'})

    firebase.auth().onAuthStateChanged((user) => {

      if (!user) {
        dispatch({type: 'USER_LOGGED_OUT'})
        deleteCookie('loggedIn', getDomain())
        return
      }

      firebase.database().ref('allUsers/' + user.uid).once('value')
        .then(snap => {

          if(!snap.val()) {
            console.log('uid not found in allUsers List');
            return firebase.auth().signOut()
          }

          console.log('not here ?');
          createCookie('loggedIn', 'true', getDomain(), 1000)

          dispatch({type: 'USER_LOGGED_IN' })
          dispatch({type: 'SET_ACCOUNT_ID',       payload: snap.val().account})
          dispatch({type: 'SET_CURRENT_USER_ID',  payload: snap.val().userID})

          window.accountID = snap.val().account // this is little hacky.. so helper function can have access to accountID without getState()
          checkClientDate(dispatch)
          initializor()
        })
    })
  }
}
