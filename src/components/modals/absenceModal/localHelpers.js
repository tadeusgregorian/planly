import moment from 'moment'
import 'moment-feiertage'
import { weekDays } from 'constants/roster'
import type { Day, ExcludedDays, BundeslandCode } from 'types/index'

const numToWeekDay = (num: number): Day => {
  return weekDays[num]
}

export const getTotalDays = (start: ?moment, end: ?moment): number | null => {
  if(!start || !end) return null
  return moment(end).diff(start, 'days') + 1
}

export const getEffectiveDays = (start: ?moment, end: ?moment, excludedDays: ?ExcludedDays, bundesland: BundeslandCode): number | null => {
  if(!start || !end) return null
  let excludedsCount = 0
  const totalDays = moment(end).diff(start, 'days') + 1

  for(let i = 0; i < totalDays; i++){
    const curDay = moment(start).add(i, 'days')
    const curWeekDay = numToWeekDay(curDay.weekday())
    const isHoliday = curDay.isHoliday('HH')

    if((excludedDays && excludedDays[curWeekDay]) || isHoliday) ++excludedsCount
  }

  return totalDays - excludedsCount
}
