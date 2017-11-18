// @flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { BundeslandCode } from 'types/index'

export const saveWorkdaysPerWeek = (workDaysPerWeek: number) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'workdaysPerWeek'])).set(workDaysPerWeek)
}

export const saveUseAvgHoursForVac = (useAvgHours: boolean) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'useAvgHoursForVac'])).set(useAvgHours)
}

export const saveUseAvgHoursForIll = (useAvgHours: boolean) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'useAvgHoursForIll'])).set(useAvgHours)
}

export const saveBundeslandToDB = (code: BundeslandCode) => {
  db().ref(getFBPath('accountDetails', ['preferences', 'bundesland'])).set(code)
}
