import type { ShiftInput, MinimalShift } from 'types/index'
import { timeStringToMin } from 'helpers/index'

export const shiftTimesValid = (shiftObj: ShiftInput): boolean => {
  const { startTime, endTime, breakMinutes } = shiftObj
  if(startTime.length !== 5) return false
  if(endTime.length !== 5) return false
  if(timeStringToMin(startTime) > timeStringToMin(endTime)) return false
  if((timeStringToMin(endTime) - timeStringToMin(startTime) - parseInt(breakMinutes, 10)) < 0) return false
  console.log('ARE YOU HERE ?')
  return true
}

const cleanBreak = (inp: string) => (inp && inp !== '0') ? parseInt(inp, 10) : 0

export const zipShift = (shiftObj: ShiftInput): MinimalShift => ({
  s: timeStringToMin(shiftObj.startTime),
  e: timeStringToMin(shiftObj.endTime),
  b: cleanBreak(shiftObj.breakMinutes)
})
