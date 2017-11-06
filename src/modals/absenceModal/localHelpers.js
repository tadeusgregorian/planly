//@flow
import moment from 'moment'
//import 'moment-feiertage'
import { weekDays } from 'constants/roster'
import type { Day, WorkDays, BundeslandCode, User, Absence, AbsenceStatus } from 'types/index'

const numToWeekDay = (num: number): Day => {
  return weekDays[num]
}

export const getTotalDays = (start: ?moment, end: ?moment): number | null => {
  if(!start || !end) return null
  return moment(end).diff(start, 'days') + 1
}

export const getEffectiveDays = (start: ?moment, end: ?moment, workDays: ?WorkDays, bundesland: BundeslandCode): number | null => {
  if(!start || !end) return null
  let excludedsCount = 0
  const totalDays = moment(end).diff(start, 'days') + 1

  for(let i = 0; i < totalDays; i++){
    const curDay = moment(start).add(i, 'days')
    const curWeekDay = numToWeekDay(curDay.weekday())
    // $FlowFixMe -> moment-feiertage hat moment extended -> moment doesnt get that.
    const isHoliday = curDay.isHoliday(bundesland)

    if((!workDays || !workDays.hasOwnProperty(curWeekDay)) || isHoliday) ++excludedsCount
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
