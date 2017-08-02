import firebase from 'firebase'
import { trackFBListeners } from './firebaseHelpers'


export const setAuthStateListener = () => {
  return (dispatch, getState) => {
    trackFBListeners(dispatch, getState, 'firebaseAuth', 'noPath')

    firebase.auth().onAuthStateChanged((user) => {
      dispatch({type: user ? 'USER_LOGGED_IN' : 'USER_LOGGED_OUT'})
    })
  }
}
