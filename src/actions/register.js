//@flow

import firebase from 'firebase'
import moment from 'moment'
import { generateGuid, getThisMondaySmart, momToSmartWeek } from 'helpers/index'
import type { User, Position, Branch, InitialOvertime} from 'types/index'

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
      weeklyHours: {[momToSmartWeek(moment())]: 40},
      status: 'active',
      isAdmin: true,
      isSuperAdmin: true, // SuperAdmin is only the creator of the account.
      initialOvertime: { smartWeek: momToSmartWeek(moment()), hours: 0 },
      workDays: { mo: 6.67, tu: 6.67, we: 6.67, th: 6.67, fr: 6.67, sa: 6.67, su: 6.67 }
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
      id: 'p001', name: 'Manager', color: 'orange', shortcut: 'MAN'
    },
    p002: {
      id: 'p002', name: 'Mitarbeiter', color: 'blue', shortcut: 'MIT'
    }
  },
  roster: {
    templatesFlat: {
      defaultTemplate_b001: {
        branch: 'b001',
        name: 'unbenannt',
        id: 'defaultTemplate_b001',
      }
    }
  }
})
