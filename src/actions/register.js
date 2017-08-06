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
  userID: '001'
})

const getEmptyAccount = (adminEmail) => ({
  creationDate: firebase.database.ServerValue.TIMESTAMP,
  users: {
    'u001': {
      id: 'u001',
      name: 'Tadeus Gregorius',
      email: adminEmail,
      position: 'u002'
    }
  },
  branches: {
    'u001': {
      id: 'u001',
      name: 'Hauptfiliale', color: 'green'
    }
  },
  positions: {
    'u001': {
      id: 'u001', name: 'Manager', color: 'orange'
    },
    'u002': {
      id: 'u002', name: 'Mitarbeiter', color: 'blue'
    }
  }
})
