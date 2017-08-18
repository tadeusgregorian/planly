//@flow

import type { FocusedCell } from 'types/index'
import { popOptionsWidth, popOptionsHeight } from 'constants/roster'

export const getPosition = (cell: FocusedCell) => {
  const sBDomElem = document.getElementById('shiftBoardMain')
  const sBWidth  = sBDomElem ? sBDomElem.offsetWidth : 0
  const sBHeight = sBDomElem ? sBDomElem.offsetHeight : 0

  const toTheRight = sBWidth - cell.left - cell.width > popOptionsWidth
  const toTheBottom = sBHeight - cell.top + 5 > popOptionsHeight

  return {
    right: toTheRight ? -(popOptionsWidth) + 1 : cell.width,
    top: toTheBottom ? 0 : sBHeight - cell.top - popOptionsHeight ,
    width: popOptionsWidth,
    height: popOptionsHeight
  }
}
