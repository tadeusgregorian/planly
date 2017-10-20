//@flow
import { createDataStatusReducer, createFirebaseReducer_array, createFirebaseReducer_object } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Notes, ShiftEdits, Shifts, DataStatus, TemplatesFlat, WeekAbsence, Correction } from 'types/index'

// we extract this because there is userDay, and branchDay in DB ( just needed for mobile-Firebase-Querys)
const extractShift = (data) => {
  const { id, s, e, b, user, day, isOpen, position, note, edit, location } = data
  return { id, s, e, b, user, day, isOpen, position, note, edit, location }
}

export type Roster = {
  notes: Notes,
  shiftEdits: ShiftEdits,
  shiftWeek: Shifts,
  weekSums: {[string]: number},
  corrections: Array<Correction>,
  templatesFlat: TemplatesFlat,
  weekAbsences: Array<WeekAbsence>,
  shiftWeekDataStatus: DataStatus,
}

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  templatesFlat: createFirebaseReducer_array('templatesFlat'),
  shiftEdits: createFirebaseReducer_array('shiftEdits'),
  weekSums: createFirebaseReducer_object('weekSums'),
  corrections: createFirebaseReducer_array('corrections'),
  weekAbsences: createFirebaseReducer_array('weekAbsences'),
  shiftWeek: createFirebaseReducer_array('shiftWeek', extractShift),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek')
})
