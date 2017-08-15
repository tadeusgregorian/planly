import firebase from 'firebase'

export const initFirebase = () => {
  firebase.initializeApp({
    apiKey: "AIzaSyCHXizDBRTQ_0JpB5-k8FzCRu3UWgCNnxI",
    authDomain: "plandy-91a56.firebaseapp.com",
    databaseURL: "https://plandy-91a56.firebaseio.com",
    projectId: "plandy-91a56",
  })
  return {type: 'FIREBASE_INITIALIZED'}
}

export const db = () => firebase.database()
