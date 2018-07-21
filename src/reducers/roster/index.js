//@flow

import { createDataStatusReducer, createFirebaseReducer_array, createFirebaseReducer_object } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Notes, ShiftEdits, Shifts, DataStatus, TemplatesFlat, Correction, ExtraHours, DayNote, AbsenceWeekly } from 'types/index'

const correctionsSame = (c1, c2) => c1.user === c2.user && c1.week === c2.week
const shiftEditsSame = (e1, e2) => e1.shiftID === e2.shiftID

export type Roster = {
  notes: Notes,
  shiftEdits: ShiftEdits,
  shiftWeek: Shifts,
  extraHours: Array<ExtraHours>,
  weekSums: {[string]: number},
  absencesWeekly: Array<AbsenceWeekly>,
  corrections: Array<Correction>,
  templatesFlat: TemplatesFlat,
  dayNotes: Array<DayNote>,
  shiftWeekDataStatus: DataStatus,
  absencesWeeklyDataStatus: DataStatus,
}

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  templatesFlat: createFirebaseReducer_array('templatesFlat'),
  shiftEdits: createFirebaseReducer_array('shiftEdits', null, shiftEditsSame), // default checks .id properties to compare, if none -> need to pas in comparer func
  weekSums: createFirebaseReducer_object('weekSums'),
  absencesWeekly: createFirebaseReducer_array('absencesWeekly'),
  corrections: createFirebaseReducer_array('corrections', null, correctionsSame),
  shiftWeek: createFirebaseReducer_array('shiftWeek'),
  extraHours: createFirebaseReducer_array('extraHours'),
  dayNotes: createFirebaseReducer_array('dayNotes'),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek'),
  absencesWeeklyDataStatus: createDataStatusReducer('absencesWeekly'),
})
