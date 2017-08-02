import firebase from 'firebase'

export const initFirebase = () => {
  firebase.initializeApp({
    apiKey: "AIzaSyBU4MlvJS5fn2RxoNuawOPf8RXSwE1-ZBs",
    authDomain: "auth-7aab8.firebaseapp.com",
    databaseURL: "https://auth-7aab8.firebaseio.com",
    projectId: "auth-7aab8",
  })
  return {type: 'FIREBASE_INITIALIZED'}
}
