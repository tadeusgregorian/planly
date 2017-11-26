//@flow
import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Absence, DataStatus, AbsenceCorrection } from 'types/index'

export type AbsencePlaner = {
  absences: Array<Absence>,
  vacationRequests: Array<Absence>,
  absenceCorrections: Array<AbsenceCorrection>,
  absencesDataStatus: DataStatus,
}

export default combineReducers({
  absences: createFirebaseReducer_array('absences'),
  vacationRequests: createFirebaseReducer_array('vacationRequests'),
  absenceCorrections: createFirebaseReducer_array('absenceCorrections'),
  absencesDataStatus: createDataStatusReducer('absences')
})
