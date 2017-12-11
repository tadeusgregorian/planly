//@flow

import firebase from 'firebase'
import { generateGuid } from 'helpers/index'
import { beginningOfTime } from 'constants/roster'
import type { User, Position, Branch, BundeslandCode } from 'types/index'

type AccData = { name: string, email:string, branch: string, bundesland: BundeslandCode }
export const createAccount = (firebaseUserID: string, accData: AccData) => {
  const accountID = generateGuid()
  let updates = {}
  updates['accountsFlat/'+ accountID]  = accData.email
  updates['accounts/'+ accountID]      = getEmptyAccount(accData)
  updates['allUsers/'+ firebaseUserID] = getFirstUserFB(accountID, accData.email)
  return firebase.database().ref().update(updates)
}

const getFirstUserFB = (accountID, email) => ({
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

const getEmptyAccount = (accData: AccData): DBAccount => ({
  accountDetails: {
    creationDate: firebase.database.ServerValue.TIMESTAMP,
    preferences: {
      bundesland: accData.bundesland, // not yet set
      workdays: false, // not yet set -> can be 5 or 6
    }
  },
  users: {
    u001: {
      id: 'u001',
      name: accData.name,
      email: accData.email,
      position: 'p001',
      branches: { b001: true },
      weeklyMins: { [beginningOfTime]: 2400 },
      workDays: { mo: 1, tu: 1, we: 1, th: 1, fr: 1 },
      status: 'ACTIVE',
      isAdmin: true,
      isSuperAdmin: true, // SuperAdmin is only the creator of the account.
    }
  },
  branches: {
    b001: {
      id: 'b001',
      name: accData.branch
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
