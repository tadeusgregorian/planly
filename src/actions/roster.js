import db from './firebasedb'
import { getFirebasePath } from './actionHelpers'

const dummyShift = {
  uid: 'u002',
  bid: 'b001',
  days: {
    mo: { s: 300, e: 8000, b: 30 },
    // tu: { s: 300, e: 8000, b: 30 },
    // we: { s: 200, e: 2300, b: 60 },
    // sa: { s: 700, e: 2700, b: 30 }
  }
}

export const createDummyShift = () => {
  db().ref(getFirebasePath('roster')).child('shiftWeeks/201732/b001u002').set(dummyShift)
}
