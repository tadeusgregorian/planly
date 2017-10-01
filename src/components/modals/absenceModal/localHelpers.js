import moment from 'moment'
import 'moment-feiertage'
import { weekDays } from 'constants/roster'
import { momToSmart, smartToMom } from 'helpers/index'
import type { Day, ExcludedDays, BundeslandCode } from 'types/index'

const numToWeekDay = (num: number): Day => {
  return weekDays[num]
}

export const getTotalDays = (start: number, end: number) => {
  const momStart = smartToMom(start)
  const momEnd = smartToMom(end)
  return momEnd.diff(momStart, 'days') + 1
}

export const getEffectiveDays = (start: number, end: number) => {
  return 7
}

export const getEffectiveDays2 = (start: number, end: number, excludedDays: ExcludedDays, bundesland: BundeslandCode) => {
  if(!start || !end) return
  let excludedsCount = 0
  const totalDays = getTotalDays(start, end)
  const momStart = smartToMom(start)

  for(let i = 0; i < totalDays; i++){
    const curDay = moment(momStart).add(i, 'days')
    const curWeekDay = numToWeekDay(curDay.weekday())
    const isHoliday = curDay.isHoliday('HH')

    if(excludedDays[curWeekDay] || isHoliday) ++excludedsCount
  }
  
  return totalDays - excludedsCount
}
