//@flow
import moment from 'moment'
import type { Shift, MinimalShift, Day } from 'types/index'

export const weekDays = [ 'mo', 'tu', 'we', 'th', 'fr', 'sa', 'su' ]

export const getRealCurrentWeekID = () :string => {
  const calendarWeek = moment().week()
  const year = moment().year()
  return year.toString() + calendarWeek.toString()
}

// extracts and returns the year out of the weekID
export const getYear = (weekID: string | number) =>
  parseInt(weekID.toString().substr(0, 4), 10)

  // extracts and returns the week out of the weekID
export const getWeek = (weekID: string | number) =>
  parseInt(weekID.toString().substr(4, 2), 10)

export const weekIDToMoment = (sw: string): moment => {
  return moment().year(getYear(sw)).week(getWeek(sw)).startOf('week')
}

export const momentToWeekID = (mom: moment): string => {
  return mom.year() + doubleD(mom.week())
}

// turns a num like 8 into '08' and 44 into '44'
export const doubleD = (num: number) => {
  if(!Number.isInteger(num)) throw new Error('Tade - doublD expects Integer number, but got' + num)
  if(num < -9) return num.toString()
  return num > 9 ?    num.toString() : '0' + num
}

export const getNextWeekID = (sw: string) :string => {
  const newMom = weekIDToMoment(sw).add(1, 'week')
  return momentToWeekID(newMom)
}

export const getPrevWeekID = (sw: string) :string => {
  const newMom = weekIDToMoment(sw).subtract(1, 'week')
  return momentToWeekID(newMom)
}

export const minToTime = (mins: number): {hours: number, minutes: number} => {
  const minsAbs = Math.abs(mins)
  const hours = Math.floor(minsAbs / 60)
  const minutes = minsAbs % 60
  return { hours, minutes }
}

export const minToTimeString = (mins: number): string => {
  const hours = Math.floor(mins / 60)
  const minutes = Math.abs(mins) % 60
  return doubleD(hours) + ':' + doubleD(minutes)
}

export const shiftToString = (shift: MinimalShift): string =>
  minToTimeString(shift.s) + ' - ' + minToTimeString(shift.e)

export const 	timeStringToMin = (str: string): number => {
  if(str === '') return 0
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

export const extractHours = (num: number): number => // returns how many full hours are contained in mins
  Math.floor(Math.abs(num) / 60) * (num < 0 ? -1 : 1 )

export const withSign = (num: number): string => // ads a '+' or '-' to a number
  num < 0 ? '- ' + num.toString().substring(1) : '+ ' + num
