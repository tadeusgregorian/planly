//@flow

import type { ShiftCell } from 'types/index'
import { shiftCellWidth, shiftCellHeight } from 'constants/roster'

export const getDirection = (cell: ShiftCell, popoverHeight: number) => {
  const sBDomElem = document.getElementById('shiftBoardMain')
  const shiftBoardHeight = sBDomElem ? sBDomElem.offsetHeight : 0
  return cell.top + shiftCellHeight + popoverHeight < shiftBoardHeight ? 'bottom' : 'top'
}

export const getPosition = (cell: ShiftCell, popoverHeight: number) => {
  return {
    top: getDirection(cell, popoverHeight) === 'bottom' ? cell.top + shiftCellHeight : cell.top - popoverHeight,
    left: cell.left,
    width: shiftCellWidth + 1
  }
}

export const cellChanged = (cell1: ShiftCell, cell2: ShiftCell) =>
  cell1.user !== cell2.user || cell1.day !== cell2.day
