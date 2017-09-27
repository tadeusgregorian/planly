//@flow
import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Notes, ShiftEdits, Shifts, DataStatus, TemplatesFlat } from 'types/index'


// we extract this because there is userDay, and branchDay in DB ( just needed for mobile )
const extractShift = (data) => {
  const { id, s, e, b, user, day, isOpen, position, note, edit, location } = data
  return { id, s, e, b, user, day, isOpen, position, note, edit, location }
}

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
  shiftEdits: createFirebaseReducer_array('shiftEdits'),
  shiftWeek: createFirebaseReducer_array('shiftWeek', extractShift),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek')
})
