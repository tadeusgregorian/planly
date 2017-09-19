//@flow

import { createSelector } from 'reselect'
import type { Shift, ShiftCell } from 'types/index'


const getShiftWeek 	  = (state) => state.roster.shiftWeek
const getShiftCell	= (state) => state.ui.roster.shiftBoard.focusedCell

const isComplimentary = (s: Shift, f: ShiftCell) => s.day === f.day && s.user === f.user

const getFocusedShift = (shiftWeek, focusedCell) => {
  if(!focusedCell) return null

  return shiftWeek.find(shift => isComplimentary(shift, focusedCell)) || null
}

export default createSelector([getShiftWeek, getShiftCell], getFocusedShift)
