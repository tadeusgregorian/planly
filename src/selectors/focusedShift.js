//@flow

import { createSelector } from 'reselect'
import type { Shift, ShiftCell } from 'types/index'


const getShiftWeek 	  = (state) => state.roster.shiftWeek
const getShiftCell	= (state) => state.ui.roster.shiftBoard.focusedCell

const isComplimentary = (s: Shift, f: ShiftCell) => s.day === f.day && s.user === f.user

const getFocusedShift = (shiftWeek, focusedCell) => {
  if(!focusedCell) return null

  const focusedShift = shiftWeek.find(shift => isComplimentary(shift, focusedCell))
  return focusedShift || { s: '', e: '', b: '' }
}

export default createSelector([getShiftWeek, getShiftCell], getFocusedShift)
