import moment from 'moment'
import { smartToMom, doubleD } from 'helpers/index'
import type { Absence, User } from 'types/index'

export const extendForDB = (user: User, absence: Absence): Absence => {
  const touchingWeeks = getTouchingWeeks(absence)
  const yearUser      = absence.year.toString() + absence.user

  return { ...absence, touchingWeeks, yearUser }
}

export const getTouchingWeeks = (absence: Absence ): {} => {
  const startDate = smartToMom(absence.startDate)
  const endDate = smartToMom(absence.endDate)
  const totalDays = endDate.diff(startDate, 'days') + 1
  const touchingWeeks = {}

  for( let i = 0; i < totalDays; i++){
    const curDay = moment(startDate).add(i, 'days')
    const curSmartWeek = absence.year + '' + doubleD(curDay.week())
    touchingWeeks[curSmartWeek] = '06'
  }

  const firstWeek = getFirstWeek(touchingWeeks)
  const lastWeek = getLastWeek(touchingWeeks)

  touchingWeeks[firstWeek] = replaceStart(touchingWeeks[firstWeek], startDate.weekday())
  touchingWeeks[lastWeek] = replaceEnd(touchingWeeks[lastWeek], endDate.weekday())

  return touchingWeeks
}

const replaceStart = (str: string, newChar: string): string =>
  newChar + str.substr(1, 1)

const replaceEnd = (str: string, newChar: string): string =>
  str.substr(0, 1) + newChar

const getFirstWeek = (touchingWeeks) =>
  Object.keys(touchingWeeks).sort()[0]

const getLastWeek = (touchingWeeks) =>
  Object.keys(touchingWeeks).sort().reverse()[0]
