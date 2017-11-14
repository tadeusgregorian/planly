//@flow
import firebase from 'firebase'
import { trackFBListeners } from './firebaseHelpers'
import { checkClientDate } from '../clientDateCheck'
import { createCookie } from './localHelpers';
import type { GetState } from 'types/index'


export const setAuthStateListener = (initializor: Function) => {
  return (dispatch: Dispatch, getState: GetState) => {

    trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
    dispatch({type: 'USER_IS_AUTHENTICATING'})

    firebase.auth().onAuthStateChanged((user) => {

      console.log('Auth State change');

      if (!user) return dispatch({type: 'USER_LOGGED_OUT'})

      firebase.database().ref('allUsers/' + user.uid).once('value')
        .then(snap => {
          if(!snap.val()) return firebase.auth().signOut()

          user.getIdToken(false).then(idToken => {
            createCookie('__session', idToken, 10)
          }).catch(e => console.log('gettingTokenFailedTade: ', e))

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
