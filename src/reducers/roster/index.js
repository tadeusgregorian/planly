//@flow

import { createDataStatusReducer, createFirebaseReducer_array, createFirebaseReducer_object } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Notes, ShiftEdits, Shifts, DataStatus, TemplatesFlat, WeekAbsence, Correction, ExtraHours, DayNote } from 'types/index'

// we extract this because there is userDay, and branchDay in DB ( just needed for mobile-Firebase-Querys)
//const cleanUp = (data) => _.omit(data, ['userDay', 'branchDay', 'branch'])

const correctionsSame = (c1, c2) => c1.user === c2.user && c1.week === c2.week
const shiftEditsSame = (e1, e2) => e1.shiftID === e2.shiftID

export type Roster = {
  notes: Notes,
  shiftEdits: ShiftEdits,
  shiftWeek: Shifts,
  extraHours: Array<ExtraHours>,
  weekSums: {[string]: number},
  corrections: Array<Correction>,
  templatesFlat: TemplatesFlat,
  weekAbsences: Array<WeekAbsence>,
  dayNotes: Array<DayNote>,
  shiftWeekDataStatus: DataStatus,
  weekAbsencesDataStatus: DataStatus,
}

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  templatesFlat: createFirebaseReducer_array('templatesFlat'),
  shiftEdits: createFirebaseReducer_array('shiftEdits', null, shiftEditsSame), // default checks .id properties to compare, if none -> need to pas in comparer func
  weekSums: createFirebaseReducer_object('weekSums'),
  corrections: createFirebaseReducer_array('corrections', null, correctionsSame),
  weekAbsences: createFirebaseReducer_array('weekAbsences'),
  shiftWeek: createFirebaseReducer_array('shiftWeek'),
  extraHours: createFirebaseReducer_array('extraHours'),
  dayNotes: createFirebaseReducer_array('dayNotes'),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek'),
  weekAbsencesDataStatus: createDataStatusReducer('weekAbsences'),
})
