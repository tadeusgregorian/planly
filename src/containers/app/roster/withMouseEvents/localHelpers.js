//@flow

import type { CellRef, ShiftRef } from 'types/index'
import { closest } from 'helpers/index'

export const elementIsShift = (el: HTMLElement): boolean =>
  !!(el.getAttribute && el.getAttribute('data-target-type') === 'shift')

export const elementIsShiftCell = (el: HTMLElement): boolean =>
  !!(el.getAttribute && el.getAttribute('data-target-type') === 'shiftcell')

export const elementIsNoteIcon = (el: HTMLElement): boolean =>
  !!(el.getAttribute && el.getAttribute('data-target-type') === 'noteicon')

export const getParentShift = (el: HTMLElement): (ShiftRef | null) => {
  const shiftElement = closest(el, (element) => elementIsShift(element))
  return shiftElement ? targetToShiftRef(shiftElement) : null
}

export const getParentCell = (el: HTMLElement): ?CellRef => {
  const shiftCellElement = closest(el, (element) => elementIsShiftCell(element))
  return shiftCellElement ? targetToShiftCell(shiftCellElement) : null
}

export const targetToShiftRef = (target: HTMLElement): ShiftRef => {
  const day: any      = target.getAttribute('data-day')
  const user: any     = target.getAttribute('data-user')
  const id: any       = target.getAttribute('data-shift-id')
  const hasEdit: any  = target.getAttribute('data-has-edit') === 'true'

  const top         = target.offsetTop
  const left        = target.offsetLeft
  const width       = target.offsetWidth
  const height      = target.offsetHeight
  const dimensions = { top, left, width, height }

  return { day, user, id, hasEdit, dimensions }
}

export const targetToShiftCell = (target: HTMLElement): CellRef => {
  const day       = target.getAttribute('data-day')
  const user      = target.getAttribute('data-user')
  const hasShift  = target.getAttribute('data-has-shift') === 'true'

  const shiftCell: CellRef = ({ day, user, hasShift } : any) // forcefully Typekasting
  return shiftCell
}

export const sameShiftCells = (cell1: ?CellRef, cell2: ?CellRef): boolean => {
  if(!cell1 && !cell2) return true
  if(!cell1 &&  cell2) return false
  if( cell1 && !cell2) return false
  const pattern1 = cell1 && cell1.day + cell1.user
  const pattern2 = cell2 && cell2.day + cell2.user
  return pattern1 === pattern2
}
