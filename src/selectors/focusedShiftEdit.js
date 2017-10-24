//@flow

import { createSelector } from 'reselect'
import type { ShiftEdits, CellRef } from 'types/index'


const getShiftEdits = (state) => state.roster.shiftEdits
const getShiftCell	= (state) => state.ui.roster.shiftBoard.focusedCell
const getWeekID	= (state) => state.ui.roster.currentWeekID
const getBranch	    = (state) => state.ui.roster.currentBranch

const getFocusedShiftEdit = (shiftEdits: ShiftEdits, focusedCell: CellRef, weekID, branch) => {
  if(!focusedCell) return null
  if(!shiftEdits) return null

  const focusedShiftEdit = shiftEdits.find(s =>
    s.day === focusedCell.day &&
    s.user === focusedCell.user &&
    s.weekID === weekID &&
    s.branch === branch
  )
  return focusedShiftEdit || null
}

export default createSelector([getShiftEdits, getShiftCell, getWeekID, getBranch], getFocusedShiftEdit)
