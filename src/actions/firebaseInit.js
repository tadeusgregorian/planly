import firebase from 'firebase'

export const initFirebase = () => {
  if(process.env.REACT_APP_ENV === 'production'){
    firebase.initializeApp({
      apiKey: "AIzaSyDN42YFUUW6a73BncV17h8pzOKJJUlJO-E",
      authDomain: "aplano-c4071.firebaseapp.com",
      databaseURL: "https://aplano-c4071.firebaseio.com",
      projectId: "aplano-c4071", // project-name: aplano
    })
  }else{
    firebase.initializeApp({
      apiKey: "AIzaSyCHXizDBRTQ_0JpB5-k8FzCRu3UWgCNnxI",
      authDomain: "plandy-91a56.firebaseapp.com",
      databaseURL: "https://plandy-91a56.firebaseio.com",
      projectId: "plandy-91a56", // project-name: aplano-dev
    })
  }

  return {type: 'FIREBASE_INITIALIZED'}
}

export const db = () => firebase.database()
