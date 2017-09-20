//@flow

import type { ShiftCell, ShiftRef } from 'types/index'

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

export const getParentCell = (el: HTMLElement): ?ShiftCell => {
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

export const targetToShiftCell = (target: HTMLElement): ShiftCell => {
  const day       = target.getAttribute('data-day')
  const user      = target.getAttribute('data-user')
  const hasShift  = target.getAttribute('data-has-shift') === 'true'

  const shiftCell: ShiftCell = ({ day, user, hasShift } : any) // forcefully Typekasting
  return shiftCell
}

// checks if the function fn is true for a node or a parent node.
export const closest = (el: any, fn: (any)=>boolean) => {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}
