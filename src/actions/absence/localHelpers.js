//@flow
import moment from 'moment'
import type { AbsencePreDB, AbsenceDB } from 'types/index'
import { smartToMom } from 'helpers/index'

export const getTouchingWeeks = (absence: AbsencePreDB ): {} => {
  const startDate = smartToMom(absence.startDate)
  const touchingWeeks = {}

  for( let i = 0; i < absence.totalDays; i++){
    const curDay = moment(startDate).add(i, 'days')
    const curSmartWeek = absence.year + '' + curDay.week()
    touchingWeeks[curSmartWeek] = 1
  }

  return touchingWeeks
}

export const extendForDB = (absence: AbsencePreDB): AbsenceDB => {
  const yearUser = absence.year + absence.user
  const touchingWeeks = getTouchingWeeks(absence)
  const startWeekDay = smartToMom(absence.startDate).weekday()
  const endWeekDay = smartToMom(absence.endDate).weekday()
  const startWeek = smartToMom(absence.endDate).week()
  const endWeek = smartToMom(absence.endDate).week()
  return { ...absence, yearUser, touchingWeeks, startWeekDay, endWeekDay, startWeek, endWeek }
}

export const rangesOverlap = (xS: number, xE: number, yS:number, yE:number): boolean => {
  return yS <= xE && yE >= xS
}
