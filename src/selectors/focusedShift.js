import { createSelector } from 'reselect'

const getShiftWeek 	  = (state) => state.roster.shiftWeek
const getFocusedCell	= (state) => state.ui.roster.weekPlan.focusedCell

const getFocusedShift = (shiftWeek, focusedCell) => {
  if(!shiftWeek || !focusedCell)                      return {s: null, e: null, b: null}
  if(!shiftWeek[focusedCell.user])                    return {s: null, e: null, b: null}
  if(!shiftWeek[focusedCell.user][focusedCell.day])   return {s: null, e: null, b: null}

  return shiftWeek[focusedCell.user][focusedCell.day]
}

export default createSelector([getShiftWeek, getFocusedCell], getFocusedShift)
