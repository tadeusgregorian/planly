// @flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'

export const saveWorkdaysPerWeek = (workDaysPerWeek: number) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'workdaysPerWeek'])).set(workDaysPerWeek)
}

export const saveUseAvgHoursForVac = (useAvgHours: boolean) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'useAvgHoursForVac'])).set(useAvgHours)
}

export const saveUseAvgHoursForIll = (useAvgHours: boolean) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'useAvgHoursForIll'])).set(useAvgHours)
}
