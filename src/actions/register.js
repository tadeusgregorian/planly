import firebase from 'firebase'
import { generateGuid } from 'helpers/general'

export const createAccount = (firebaseUserID, email) => {
  const accountID = generateGuid()
  let updates = {}
  updates['accounts/'+ accountID] = getEmptyAccount(email)
  updates['allUsers/'+ firebaseUserID] = getFirstUser(accountID, email)
  firebase.database().ref().update(updates)
}


const getFirstUser = (accountID, email) => ({
  account: accountID,
  userID: '001',
  email: email
})

const getEmptyAccount = (adminEmail) => ({
  creationDate: firebase.database.ServerValue.TIMESTAMP,
  users: {
    '001': {
      id: '001',
      name: 'Tadeus Gregorius',
      email: adminEmail
    }
  },
  branches: {
    '001': {
      id: '001',
      name: 'Hauptfiliale'
    }
  },
  positions: {
    '001': {
      id: '001', name: 'Manager'
    },
    '002': {
      id: '002', name: 'Mitarbeiter'
    }
  }
})
