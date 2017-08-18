import firebase from 'firebase'
import { trackFBListeners } from './firebaseHelpers'
import { checkClientDate } from '../clientDateCheck'


export const setAuthStateListener = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {

      trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')
      dispatch({type: 'USER_IS_AUTHENTICATING'})

      firebase.auth().onAuthStateChanged((user) => {
        dispatch({type: user ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT'})

        console.log('Getting here ?', user);

        if (!user) reject()
        if (!user) return // only if logging in from here on

        firebase.database().ref('allUsers/' + user.uid).once('value')
          .then(snap => {
            if(!snap.val()) return

            dispatch({type: 'SET_ACCOUNT_ID',       payload: snap.val().account})
            dispatch({type: 'SET_CURRENT_USER_ID',  payload: snap.val().userID})

            window.accountID = snap.val().account // this is little hacky.. so helper function can have access to accountID without getState()
            checkClientDate(dispatch)
            resolve(true)
          })
      })
    })
  }
}
