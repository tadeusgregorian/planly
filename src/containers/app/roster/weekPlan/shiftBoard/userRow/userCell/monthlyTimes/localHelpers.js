//@flow
import {weekDays} from 'constants/roster';
import moment from 'moment'
import type {Day} from 'types/index'

export const getWeekDaysInMonth = (year: number, month: number): Array<Day> => {

  const firstOfMonthMom = moment().year(year).month(month).date(1)
  const firstOfMonthWeekDay = firstOfMonthMom.weekday()
  const daysInMonth = firstOfMonthMom.daysInMonth()
  const WeekDaysInMonth = []

  for(let i = 0; i < daysInMonth; i++){
    WeekDaysInMonth[i] = weekDays[( i + firstOfMonthWeekDay) % 7]
  }
  return WeekDaysInMonth
}
