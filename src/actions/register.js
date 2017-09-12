//@flow

import firebase from 'firebase'
import { generateGuid, getThisMondaySmart } from 'helpers/index'
import type { User, Position, Branch} from 'types/index'

export const createAccount = (firebaseUserID: string, email: string) => {
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

type DBAccount = {
  users: { [string]: User },
  branches: { [string]: Branch },
  positions: { [string]: Position }
}

const getEmptyAccount = (adminEmail): DBAccount => ({
  creationDate: firebase.database.ServerValue.TIMESTAMP,
  users: {
    u001: {
      id: 'u001',
      name: 'Tadeus Gregorius',
      email: adminEmail,
      position: 'p001',
      branches: { b001: true },
      color: '#0D47A1',
      weeklyHours: {[getThisMondaySmart()]: 40},
      status: 'active',
      isAdmin: true,
      isSuperAdmin: true, // SuperAdmin is only the creator of the account.
    }
  },
  branches: {
    b001: {
      id: 'b001',
      name: 'Hauptfiliale', color: 'green'
    }
  },
  positions: {
    p001: {
      id: 'p001', name: 'Manager', color: 'orange'
    },
    p002: {
      id: 'p002', name: 'Mitarbeiter', color: 'blue'
    }
  },
  templatesFlat:{
    branch: 'b001',
    name: 'unbenannt',
    id: 'b001'
  }
})
