//@flow
import { createSelector } from 'reselect'
import type { Notes, ShiftCell } from 'types/index'

const getNotes      = (state) => state.roster.notes
const getShiftCell	= (state) => state.ui.roster.shiftBoard.focusedCell

const getFocusedShiftEdit = (notes: Notes, focusedCell: ShiftCell): Notes => {
  if(!focusedCell) return []
  if(!notes) return []

  return notes.filter(n =>
    n.day === focusedCell.day &&
    n.user === focusedCell.user
  )
}

export default createSelector([getNotes, getShiftCell], getFocusedShiftEdit)
