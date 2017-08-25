//@flow

import { createSelector } from 'reselect'
import type { ShiftEdits, ShiftCell } from 'types/index'


const getShiftEdits = (state) => state.roster.shiftEdits
const getShiftCell	= (state) => state.ui.roster.weekPlan.focusedCell
const getSmartWeek	= (state) => state.ui.roster.currentSmartWeek
const getBranch	    = (state) => state.ui.roster.currentBranch

const getFocusedShiftEdit = (shiftEdits: ShiftEdits, focusedCell: ShiftCell, smartWeek, branch) => {
  if(!focusedCell) return null
  if(!shiftEdits) return null

  const focusedShiftEdit = shiftEdits.find(s =>
    s.day === focusedCell.day &&
    s.user === focusedCell.user &&
    s.smartWeek === smartWeek &&
    s.branch === branch
  )
  return focusedShiftEdit || null
}

export default createSelector([getShiftEdits, getShiftCell, getSmartWeek, getBranch], getFocusedShiftEdit)
