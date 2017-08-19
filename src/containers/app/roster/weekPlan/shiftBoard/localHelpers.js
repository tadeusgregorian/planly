//@flow

import type { ShiftCell, Day, Shifts, Shift } from 'types/index'
import { weekDays } from 'constants/roster'

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
  const top       = target.offsetTop
  const left      = target.offsetLeft
  const width     = target.offsetWidth
  const height    = target.offsetHeight

  const shiftCell: ShiftCell = ({ day, user, top, left, width, height } : any) // forcefully Typekasting
  return shiftCell
}

export const isSameCell = (c1: ShiftCell, c2: ShiftCell): boolean => {
  for(const key in c1){
    if(c1.hasOwnProperty(key)){
      if(c1[key] !== c2[key]) return false
    }
  }
  return true
}

export const getShiftOfCell = (shifts: Shifts, cell: ShiftCell): ?Shift =>
  shifts.find(s => s.user === cell.user && s.day === cell.day )
