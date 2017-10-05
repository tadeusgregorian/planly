//@flow
import moment from 'moment'
import type { AbsencePreDB, AbsenceDB } from 'types/index'
import { smartToMom } from 'helpers/general'

export const getTouchingWeeks = (absence: AbsencePreDB ): {} => {
  const startDate = smartToMom(absence.startDate)
  const touchingWeeks = {}

  for( let i = 0; i < absence.totalDays; i++){
    const curDay = moment(startDate).add(i, 'days')
    const curSmartWeek = absence.year + '' + curDay.week()
    touchingWeeks[curSmartWeek] = true
  }

  return touchingWeeks
}

export const extendForDB = (absence: AbsencePreDB): AbsenceDB => {
  const yearUser = absence.year + absence.user
  const touchingWeeks = getTouchingWeeks(absence)
  return { ...absence, yearUser, touchingWeeks }
}
