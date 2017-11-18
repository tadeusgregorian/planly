// @flow
import type { Day } from 'types/index'
import { weekDays } from 'helpers/roster'

export const getNextWeekDay = (day: Day): Day => {
  if(day === 'su') return 'mo'
  return weekDays[ weekDays.indexOf(day) + 1]
}

export const getPrevWeekDay = (day: Day): Day => {
  if(day === 'mo') return 'su'
  return weekDays[ weekDays.indexOf(day) - 1]
}
