import firebase from 'firebase'
import { generateGuid } from 'helpers/general'

export const createAccount = (firebaseUserID, email) => {
  const accountID = generateGuid()
  let updates = {}
  updates['accounts/'+ accountID] = {
    creationDate: firebase.database.ServerValue.TIMESTAMP,
    users: {'001': {id: '001'}}
  }
  updates['allUsers/'+ firebaseUserID] = { account: accountID, userID: '001', email: email }
  firebase.database().ref().update(updates)
}
