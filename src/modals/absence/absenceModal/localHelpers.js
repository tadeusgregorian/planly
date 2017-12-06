//@flow
import moment from 'moment'
import { momToSmart } from 'helpers/index'
import { db } from 'actions/firebaseInit'
import { getFBPath } from 'actions/actionHelpers'
import { weekDays } from 'constants/roster'
import type { BundeslandCode, User, Absence, AbsenceStatus, WorkDays } from 'types/index'
import values from 'lodash/values'

// const numToWeekDay = (num: number): Day => {
//   return weekDays[num]
// }

export const getTotalDays = (start: ?moment, end: ?moment): number | null => {
  if(!start || !end) return null
  return moment(end).diff(start, 'days') + 1
}

type         GetEffectiveDays = (?moment, ?moment, BundeslandCode | false, WorkDays) => number | null
export const getEffectiveDays: GetEffectiveDays = (start, end, bundesland, workDays ) => {
  if(!start || !end) return null
  let excludedsCount = 0
  const totalDays = moment(end).diff(start, 'days') + 1

  for(let i = 0; i < totalDays; i++){
    const curDay      = moment(start).add(i, 'days')
    const curWeekDay  = curDay.weekday()

    // $FlowFixMe -> moment-feiertage hat moment extended -> moment doesnt get that.
    const isHoliday   = curDay.isHoliday(bundesland)
    const notWorking  = !workDays[weekDays[curWeekDay]]

    if( notWorking || isHoliday) ++excludedsCount
  }
  return totalDays - excludedsCount
}

type Props = { currentUser: User, absence?: Absence }
type State = { status: AbsenceStatus }
type ButtonsToShow = { Save: boolean, Delete: boolean, Accept: boolean, Reject: boolean, Request: boolean }

export const getButtonsToShow = (props: Props , state: State): ButtonsToShow => {
  const adminMode    = !!props.currentUser.isAdmin
  const accepted     = state.status === 'accepted'
  const requested    = state.status === 'requested'
  const creationMode = !props.absence
  const Save    = (adminMode && accepted) || (!adminMode && requested && !creationMode)
  const Delete  = (adminMode && accepted && !creationMode) || (!adminMode && requested && !creationMode)
  const Accept  =  adminMode && requested
  const Reject  =  adminMode && requested
  const Request = !adminMode && requested && creationMode
  return { Save, Delete, Accept, Reject, Request }
}

type  RangesOverlap = (number, number, number, number) => boolean
const rangesOverlap: RangesOverlap  = (xStart, xEnd, yStart, yEnd) => {
  return yStart <= xEnd && yEnd >= xStart
}

type         CheckOverlapping = (moment, moment, string, string) => Promise<boolean>
export const checkOverlapping: CheckOverlapping = (start, end, user, absenceID) => {
  const startSmart = momToSmart(start)
  const endSmart   = momToSmart(end)

  return db().ref(getFBPath('absences')).orderByChild('user').equalTo(user).once('value').then(snap => {
    const absences: Array<Absence> = snap.val() ? values(snap.val()) : []

    console.log(absences);

    return absences.filter(a => a.user === user).reduce(
      (acc, val) =>
      (
        absenceID !== val.id && // otherwiese it overlaps with itselefe when editing Absence.
        rangesOverlap(val.startDate, val.endDate, startSmart, endSmart)
      ) || acc,
      false
    )
  })
}
