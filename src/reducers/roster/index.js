//@flow
import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Notes, ShiftEdits, Shifts, DataStatus, TemplatesFlat } from 'types/index'


// we extract this because there is userDay, and branchDay in DB ( just needed for mobile )
const extractShift = (data) => {
  const { id, s, e, b, user, day, isOpen, position } = data
  return { id, s, e, b, user, day, isOpen, position }
}

const extractShiftEdit = (data) => {
  const { id, s, e, b, user, day, branch, smartWeek } = data
  return { id, s, e, b, user, day, branch, smartWeek }
}

// const sameShift = (s1, s2) =>
//   s1.user === s2.user &&
//   s1.day === s2.day // &&
//   //s1.branch === s2.branch
//
// const sameShiftEdit = (s1, s2) =>
//   s1.user === s2.user &&
//   s1.day === s2.day &&
//   s1.branch === s2.branch &&
//   s1.smartWeek === s2.smartWeek

export type Roster = {
  notes: Notes,
  shiftEdits: ShiftEdits,
  shiftWeek: Shifts,
  templatesFlat: TemplatesFlat,
  shiftWeekDataStatus: DataStatus
}

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  templatesFlat: createFirebaseReducer_array('templatesFlat'),
  shiftEdits: createFirebaseReducer_array('shiftEdits', extractShiftEdit),
  shiftWeek: createFirebaseReducer_array('shiftWeek', extractShift),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek')
})
