//@flow
import moment from 'moment'
import type { AbsenceDB } from 'types/index'
import { smartToMom } from 'helpers/general'

// extends the absenceObj with touchingWeeks { 201735: userID, 201735: userID } -> for efficient Firebase querys
// includes all smartWeeks that the absence days touch. -> the value is the userID
export const getTouchingWeeks = (absence: AbsenceDB ): Array<string> => {
  const startDate = smartToMom(absence.startDate)
  const touchingWeeks = []

  for( let i = 0; i < absence.totalDays; i++){
    const curDay = moment(startDate).add(i, 'days')
    const curSmartWeek = absence.year + '' + curDay.week()
    touchingWeeks.push(curSmartWeek)
  }

  return touchingWeeks
}
