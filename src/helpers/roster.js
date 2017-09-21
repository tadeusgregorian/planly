//@flow
import moment from 'moment'
import type { Shift, Shifts, MinimalShift, ShiftCell, Notes } from 'types/index'

export const getRealCurrentWeekID = () :number => {
  const calendarWeek = moment().week()
  const year = moment().year()
  return parseInt( '' + year + calendarWeek, 10 )
}

// extracts and returns the year out of the weekID
export const getYear = (weekID: number) =>
  parseInt(weekID.toString().substr(0, 4), 10)

  // extracts and returns the week out of the weekID
export const getWeek = (weekID: number) =>
  parseInt(weekID.toString().substr(4, 2), 10)

export const weekIDToMoment = (sw: number): moment => {
  return moment().year(getYear(sw)).week(getWeek(sw)).startOf('week')
}

export const momentToWeekID = (mom: moment): number => {
  return parseInt(mom.year() + doubleD(mom.week()), 10)
}

// turns a num like 8 into '08' and 44 into '44'
export const doubleD = (num: number) => {
  if(!Number.isInteger(num) || num > 99 || num < 0) throw new Error('Tade - doublD expects Integer ( 0 - 99 ) but got' + num)
  return num > 9 ? num.toString() : '0' + num
}

export const getNextWeekID = (sw: number) :number => {
  const newMom = weekIDToMoment(sw).add(1, 'week')
  return momentToWeekID(newMom)
}

export const getPrevWeekID = (sw: number) :number => {
  const newMom = weekIDToMoment(sw).subtract(1, 'week')
  return momentToWeekID(newMom)
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

export const getNoteOfCell = (notes: Notes, cell: ShiftCell) =>
  notes.find(n => n.user === cell.user && n.day === cell.day)

export const getShiftOfCell = (shifts: Shifts, cell: ShiftCell): ?Shift =>
  cell && shifts.find(s => s.user === cell.user && s.day === cell.day )
