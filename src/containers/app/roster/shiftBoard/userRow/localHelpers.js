//@flow
import type { Shift } from 'types/index'

export const calculateWeekSum = (shifts: Array<Shift>):number => {
  return shifts.reduce((acc, shift)=> acc + shift.e - shift.s - shift.b  , 0)
}
