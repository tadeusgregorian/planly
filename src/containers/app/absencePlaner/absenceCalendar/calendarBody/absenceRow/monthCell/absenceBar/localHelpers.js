//@flow

import moment from 'moment'
import { dayWidth } from 'constants/absence'
import { smartToMom } from 'helpers/general'
import type { Absence } from 'types/index'

const getFirstDay = (absence: Absence, month: number): number => {
  const startsInPrevMonth = smartToMom(absence.startDate).month() < month
  return startsInPrevMonth ? 1 : smartToMom(absence.startDate).date()
}

const getLastDay = (absence: Absence, year: number, month: number): number => {
  const endsInNextMonth = smartToMom(absence.endDate).month() > month
  const monthLength     = moment().year(year).month(month).daysInMonth()
  return endsInNextMonth ? monthLength : smartToMom(absence.endDate).date()
}

export const getPosLeft = (absence: Absence, month: number): number => {
  const firstDay = getFirstDay(absence, month)
  return ( firstDay - 1 ) * dayWidth
}

export const getPosWidth = (absence: Absence, year: number, month: number): number => {
  const firstDay = getFirstDay(absence, month)
  const lastDay = getLastDay(absence, year, month)
  return ( lastDay - firstDay + 1 ) * dayWidth
}
