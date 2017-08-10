import firebase from 'firebase'
import { generateGuid } from 'helpers/general'

export const createAccount = (firebaseUserID, email) => {
  const accountID = generateGuid()
  let updates = {}
  updates['accounts/'+ accountID] = getEmptyAccount(email)
  updates['allUsers/'+ firebaseUserID] = getFirstUser(accountID)
  firebase.database().ref().update(updates)
}


const getFirstUser = (accountID) => ({
  account: accountID,
  userID: 'u001'
})

const getEmptyAccount = (adminEmail) => ({
  creationDate: firebase.database.ServerValue.TIMESTAMP,
  users: {
    'u001': {
      id: 'u001',
      name: 'Tadeus Gregorius',
      email: adminEmail,
      position: 'p001'
    }
  },
  branches: {
    'b001': {
      id: 'b001',
      name: 'Hauptfiliale', color: 'green'
    }
  },
  positions: {
    'p001': {
      id: 'p001', name: 'Manager', color: 'orange'
    },
    'p002': {
      id: 'p002', name: 'Mitarbeiter', color: 'blue'
    }
  }
})
