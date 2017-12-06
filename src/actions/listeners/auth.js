//@flow
import firebase from 'firebase'
import { trackFBListeners } from './firebaseHelpers'
import { checkClientDate } from '../clientDateCheck'
import { createCookie, deleteCookie } from './localHelpers';
import { getDomain } from 'configs/index'
import type { GetState } from 'types/index'
import { Toast } from 'helpers/iziToast'


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

      const _user      = firebase.database().ref('allUsers/' + user.uid).once('value')
      const _dbVersion = firebase.database().ref('dbVersion').once('value')

      Promise.all([_user, _dbVersion]).then(results => {

        const user      = results[0].val()
        const dbVersion = results[1].val()

        if(dbVersion === 'maintenance') return signOut('Wartung. In Kürze wieder da.')
        if(!user || user.deleted) return signOut('Benutzer nicht aktiviert')

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
}


const signOut = (text: string) => {
  text && Toast.error(text)
  firebase.auth().signOut()
}
