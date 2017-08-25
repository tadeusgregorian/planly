import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'

// we extract this because there is userDay, and branchDay in DB ( just needed for mobile )
const extractShift = (data) => {
  const { s, e, b, user, day, isOpen, position } = data
  return { s, e, b, user, day, isOpen, position }
}

const extractShiftEdit = (data) => {
  const { s, e, b, user, day, branch, smartWeek } = data
  return { s, e, b, user, day, branch, smartWeek }
}

const sameShift = (s1, s2) =>
  s1.user === s2.user &&
  s1.day === s2.day

const sameShiftEdit = (s1, s2) =>
  s1.user === s2.user &&
  s1.day === s2.day &&
  s1.branch === s2.branch &&
  s1.smartWeek === s2.smartWeek

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  shiftEdits: createFirebaseReducer_array('shiftEdits', sameShiftEdit, extractShiftEdit),
  shiftWeek: createFirebaseReducer_array('shiftWeek', sameShift, extractShift),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek')
})
