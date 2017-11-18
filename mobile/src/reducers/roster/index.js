//@flow
import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Notes, ShiftEdits, Shifts, DataStatus, DayNote, WeekAbsence } from 'types/index'

export type Roster = {
  notes: Notes,
  shiftEdits: ShiftEdits,
  shiftWeek: Shifts,
  dayNotes: Array<DayNote>,
  shiftWeekDataStatus: DataStatus,
  weekAbsences: Array<WeekAbsence>,
  weekAbsencesDataStatus: DataStatus,
}

export default combineReducers({
  notes: createFirebaseReducer_array('notes'),
  shiftEdits: createFirebaseReducer_array('shiftEdits'),
  dayNotes: createFirebaseReducer_array('dayNotes'),
  shiftWeek: createFirebaseReducer_array('shiftWeek'),
  shiftWeekDataStatus: createDataStatusReducer('shiftWeek'),
  weekAbsences: createFirebaseReducer_array('weekAbsences'),
  weekAbsencesDataStatus: createDataStatusReducer('weekAbsences'),
})
