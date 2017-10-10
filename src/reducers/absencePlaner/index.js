//@flow
import { createDataStatusReducer, createFirebaseReducer_array } from '../reducerHelpers'
import { combineReducers } from 'redux'
import type { Absence, DataStatus } from 'types/index'

export type AbsencePlaner = {
  absences: Array<Absence>,
  vacationRequests: Array<Absence>,
  absencesDataStatus: DataStatus,
}

export default combineReducers({
  absences: createFirebaseReducer_array('absences'),
  vacationRequests: createFirebaseReducer_array('vacationRequests'),
  absencesDataStatus: createDataStatusReducer('absences')
})
