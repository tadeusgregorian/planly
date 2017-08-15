//@flow
import moment from 'moment'
import type { Shift, MinimalShift } from 'types/index'

export const getRealCurrentSmartWeek = () :number => {
  const calendarWeek = moment().week()
  const year = moment().year()
  return parseInt( '' + year + calendarWeek, 10 )
}

// extracts and returns the year out of the smartWeek
export const getYear = (smartWeek: number) =>
  parseInt(smartWeek.toString().substr(0, 4), 10)

  // extracts and returns the week out of the smartWeek
export const getWeek = (smartWeek: number) =>
  parseInt(smartWeek.toString().substr(4, 2), 10)

export const smartWeekToMoment = (sw: number): moment => {
  return moment().year(getYear(sw)).week(getWeek(sw)).startOf('week')
}

export const momentToSmartWeek = (mom: moment): number => {
  return parseInt(mom.year() + doubleD(mom.week()), 10)
}

// turns a num like 8 into '08' and 44 into '44'
export const doubleD = (num: number) => {
  if(!Number.isInteger(num) || num > 99 || num < 0) throw new Error('Tade - doublD expects Integer ( 0 - 99 ) but got' + num)
  return num > 9 ? num.toString() : '0' + num
}

export const getNextSmartWeek = (sw: number) :number => {
  const newMom = smartWeekToMoment(sw).add(1, 'week')
  return momentToSmartWeek(newMom)
}

export const getPrevSmartWeek = (sw: number) :number => {
  const newMom = smartWeekToMoment(sw).subtract(1, 'week')
  return momentToSmartWeek(newMom)
}

export const minToTime = (mins: number): {hours: number, minutes: number, str: string} => {
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  const str = doubleD(hours) + ':' + doubleD(minutes)
  return { hours, minutes, str }
}

export const minToTimeString = (mins: number): string => {
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60
  return doubleD(hours) + ':' + doubleD(minutes)
}

export const shiftToString = (shift: MinimalShift): string =>
  minToTime(shift.s).str + ' - ' + minToTime(shift.e).str

export const 	timeStringToMin = (str: string) => {
	let hours = parseInt(str.substr(0, 2), 10)
	let minutes = parseInt(str.substr(3, 2), 10)
	return (hours * 60 + minutes)
}

export const intervalsOverlap = (start1: number, end1: number, start2: number, end2: number) => {
	if(start1 > start2) return (end2 - start1) >= 0
	if(start1 < start2) return (end1 - start2) >= 0
	if(start1 === start2) return true
}

export const shiftToMinimalShift = (shift: Shift): MinimalShift => ({
  s: shift.s, e: shift.e, b: shift.b
})
