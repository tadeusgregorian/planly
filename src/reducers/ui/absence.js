//@flow
import { combineReducers } from 'redux'
import moment from 'moment'
import { simpleReducer } from '../reducerHelpers'
import type { AbsenceType } from 'types/index'

const currentBranch = simpleReducer({
  default: 'all',
  ABSENCE_SET_CURRENT_BRANCH: 'PAYLOAD'
})

const currentYear = simpleReducer({
  default: moment().year(),
  ABSENCE_SET_CURRENT_YEAR: 'PAYLOAD'
})

const currentMonth = simpleReducer({
  default: moment().month(),
  ABSENCE_SET_CURRENT_MONTH: 'PAYLOAD'
})

const currentType = simpleReducer({
  default: 'all',
  ABSENCE_SET_CURRENT_TYPE: 'PAYLOAD'
})

export type Absence = {
  currentBranch: string,
  currentYear: number,
  currentMonth: number,
  currentType: AbsenceType | 'all'
}

export default combineReducers({
  currentBranch,
  currentYear,
  currentMonth,
  currentType,
})
