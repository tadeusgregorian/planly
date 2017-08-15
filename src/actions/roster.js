import db from './firebasedb'
import { getFirebasePath } from './actionHelpers'

const dummyShift = {
  uid: 'u001',
  bid: 'b001',
  days: {
    mo: { s: 600, e: 1000, b: 30 },
    tu: { s: 600, e: 900,  b: 30 },
    th: { s: 600, e: 1000, b: 30 },
  }
}

export const createDummyShift = () => {
  db().ref(getFirebasePath('roster')).child('shiftWeeks/201733/b001u001').set(dummyShift)
}

export const removeShiftWeek = () => {
  return {type: 'remove_shiftWeek'}
}
