//@flow

import type { ShiftCell } from 'types/index'

export const elementIsShiftCell = (el: HTMLElement): boolean =>
  !!(el.getAttribute && el.getAttribute('data-target-type') === 'shiftcell')

export const elementIsNoteIcon = (el: HTMLElement): boolean =>
  !!(el.getAttribute && el.getAttribute('data-target-type') === 'noteicon')

export const getParentShiftCell = (el: HTMLElement): ?ShiftCell => {
  const shiftCellElement = closest(el, (element) => elementIsShiftCell(element))
  return shiftCellElement ? targetToShiftCell(shiftCellElement) : null

}

// checks if the function fn is true for a node or a parent node.
export const closest = (el: any, fn: (any)=>boolean) => {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}

export const targetToShiftCell = (target: HTMLElement): ShiftCell => {
  const day       = target.getAttribute('data-day')
  const user      = target.getAttribute('data-user')
  const isOpen    = target.getAttribute('data-shift-type') === 'openshift'
  const blocked   = target.getAttribute('data-clickable') === 'blocked'
  const hasShift  = target.getAttribute('data-has-shift') === 'true'
  const hasEdit   = target.getAttribute('data-has-edit') === 'true'
  const top       = target.offsetTop
  const left      = target.offsetLeft
  const width     = target.offsetWidth
  const height    = target.offsetHeight

  const shiftCell: ShiftCell = ({ day, user, top, left, width, height, isOpen, blocked, hasShift, hasEdit } : any) // forcefully Typekasting
  return shiftCell
}
