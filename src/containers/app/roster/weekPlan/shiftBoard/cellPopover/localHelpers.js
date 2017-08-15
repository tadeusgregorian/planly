//@flow

import type { focusedCellType } from 'types/index'
import { timeStringToMin } from 'helpers/index'

export const cellChanged = (prevCell: focusedCellType, nextCell: focusedCellType) => {
  return (prevCell.day !== nextCell.day || prevCell.user !== nextCell.user)
}

export const withColon = (oldStr: string, newStr: string): string => {
  if (newStr.length === 2 && oldStr.length === 1) { return newStr + ":"}
  if (newStr.length === 2 && oldStr.length === 3) { return newStr.substr(0, 1)}
  return newStr
}

export const timeInpOK = (oldStr: string, newStr: string) =>
  !isAdding(oldStr, newStr) || isValidTimeString(newStr)


export const isAdding = (oldStr: string, newStr: string) =>
  oldStr < newStr

const getMins   = (timeString: string): number => parseInt(timeString.substr(3, 2), 10)
const getHours  = (timeString: string): number => parseInt(timeString.substr(0, 2), 10)

const isValidTimeString = (ts) => {
  let tn = 0
  let isHours = ts.length < 4
  let isMinutes = !isHours
  if(ts.length === 3) ts = ts.substr(0, 2) // getting rid of the :
  if(ts.length > 3) ts = ts.substr(3)	//getting the minutes
  if(isNaN(ts)) return false // check if really is a Number after : is gone
  tn = ts.length === 1 ? parseInt(ts+'0', 10) : parseInt(ts, 10)
  if (isHours && tn < 25) return true;
  if (isMinutes && tn < 60) return true;
  return false;
}

export const from4To5 = (prevString: string, nextString: string) =>
  prevString.length === 4 && nextString.length === 5


export const shiftInputValidAndComplete = (startTime: string, endTime: string): boolean => {
    let check = (str) => {
      if(str.length !== 5) return false
      if(getHours(str) < 0 || getHours(str) > 24) return false
      if(getMins(str)  < 0 || getMins(str) > 59) return false
      return true
    }
    if(timeStringToMin(startTime) > timeStringToMin(endTime)) return false
    return check(startTime) && check(endTime);
  }
