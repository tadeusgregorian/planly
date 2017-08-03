import firebase from 'firebase'
import { registerInitialListeners } from './init'
import { trackFBListeners } from './firebaseHelpers'
import { checkClientDate } from '../clientDateCheck'


export const setAuthStateListener = () => {
  return (dispatch, getState) => {
    trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
    dispatch({type: 'USER_IS_AUTHENTICATING'})

    firebase.auth().onAuthStateChanged((user) => {
      dispatch({type: user ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT'})

      if (!user) return // only if logging in from here on
      firebase.database().ref('allUsers/' + user.uid + '/account').once('value')
        .then(snap => {
          dispatch({type: 'SET_ACCOUNT_ID', payload: snap.val()})
          window.accountID = snap.val() // this is little hacky.. so helper function can have access to accountID without getState()
          checkClientDate(dispatch)
          registerInitialListeners(dispatch, getState)
        })
    })
  }
}
