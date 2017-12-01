//@flow

import firebase from 'firebase'
import moment from 'moment'
import { generateGuid, momToSmartWeek } from 'helpers/index'
import { beginningOfTime } from 'constants/roster'
import type { User, Position, Branch } from 'types/index'


export const createAccount = (firebaseUserID: string, email: string) => {
  const accountID = generateGuid()
  let updates = {}
  updates['accounts/'+ accountID] = getEmptyAccount(email)
  updates['allUsers/'+ firebaseUserID] = getFirstUser(accountID, email)
  firebase.database().ref().update(updates)
}

const getFirstUser = (accountID, email) => ({
  account: accountID,
  userID: 'u001',
  email: email,
  timestamp: firebase.database.ServerValue.TIMESTAMP
})

type DBAccount = {
  users: { [string]: User },
  branches: { [string]: Branch },
  positions: { [string]: Position }
}

const getEmptyAccount = (email): DBAccount => ({
  accountDetails: {
    creationDate: firebase.database.ServerValue.TIMESTAMP,
    preferences: {
      bundesland: 'HH',
      useAvgHoursForVac: true,
      workDaysPerWeek: 6,
    }
  },
  users: {
    u001: {
      id: 'u001',
      name: 'Tadeus Gregorius',
      email: email,
      position: 'p001',
      branches: { b001: true },
      weeklyMins: { [beginningOfTime]: 2400 },
      status: 'ACTIVE',
      isAdmin: true,
      isSuperAdmin: true, // SuperAdmin is only the creator of the account.
    }
  },
  branches: {
    b001: {
      id: 'b001',
      name: 'Hauptfiliale'
    }
  },
  positions: {
    p001: {
      id: 'p001', name: 'Manager', color: 'orange', shortcut: 'MAN', nr: 1
    },
    p002: {
      id: 'p002', name: 'Mitarbeiter', color: 'blue', shortcut: 'MIT', nr: 2
    }
  },
  roster: {
    templatesFlat: {
      '111random': { // only important that it starts with 111 -> sorted lexically ( needs to be lowest )
        branch: 'b001',
        name: 'Musterwoche 1',
        id: '111random',
      }
    }
  }
})
