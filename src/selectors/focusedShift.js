//@flow

import { createSelector } from 'reselect'
import type { Shift, FocusedCell } from 'types/index'


const getShiftWeek 	  = (state) => state.roster.shiftWeek
const getFocusedCell	= (state) => state.ui.roster.weekPlan.focusedCell

const isComplimentary = (s: Shift, f: FocusedCell) => s.day === f.day && s.user === f.user

const getFocusedShift = (shiftWeek, focusedCell) => {
  if(!focusedCell) return null

  const focusedShift = shiftWeek.find(shift => isComplimentary(shift, focusedCell))
  return focusedShift || { s: '', e: '', b: '' }
}

export default createSelector([getShiftWeek, getFocusedCell], getFocusedShift)
