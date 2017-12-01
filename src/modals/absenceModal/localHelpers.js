//@flow
import moment from 'moment'
import { momToSmart } from 'helpers/index'

import type { BundeslandCode, User, Absence, AbsenceStatus } from 'types/index'

// const numToWeekDay = (num: number): Day => {
//   return weekDays[num]
// }

export const getTotalDays = (start: ?moment, end: ?moment): number | null => {
  if(!start || !end) return null
  return moment(end).diff(start, 'days') + 1
}

type         GetEffectiveDays = (?moment, ?moment, BundeslandCode, boolean) => number | null
export const getEffectiveDays: GetEffectiveDays = (start, end, bundesland, excludingSaturdays ) => {
  if(!start || !end) return null
  let excludedsCount = 0
  const totalDays = moment(end).diff(start, 'days') + 1

  for(let i = 0; i < totalDays; i++){
    const curDay      = moment(start).add(i, 'days')
    const curWeekDay  = curDay.weekday()

    // $FlowFixMe -> moment-feiertage hat moment extended -> moment doesnt get that.
    const isHoliday   = curDay.isHoliday(bundesland)
    const isSaturday  = curWeekDay === 5
    const isSunday    = curWeekDay === 6


    if( (excludingSaturdays && isSaturday) || isSunday || isHoliday) ++excludedsCount
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

type         AbsenceOverlaps = (moment, moment, Array<Absence>, string, string) => boolean
export const absenceOverlaps: AbsenceOverlaps = (start, end, absences, user, absenceID): boolean => {
  const startSmart = momToSmart(start)
  const endSmart   = momToSmart(end)

  return absences.filter(a => a.user === user).reduce(
    (acc, val) =>
      (
        absenceID !== val.id && // otherwiese it overlaps with itselefe when editing Absence.
        rangesOverlap(val.startDate, val.endDate, startSmart, endSmart)
      ) || acc,
    false
  )
}
