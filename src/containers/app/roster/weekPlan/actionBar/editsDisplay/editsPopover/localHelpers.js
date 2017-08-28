import { closest } from 'helpers/general'

export const isInsidePopover = (target: HTMLElement) =>
  !!closest(target, (t) => { return (
    t.getAttribute && t.getAttribute('data-type') === 'editspopover'
  )})

export const isEditRow = (target: HTMLElement) =>
  target.getAttribute && target.getAttribute('data-type') === 'jumpto'

export const getBranch = (target: HTMLElement) =>
  target.getAttribute('data-branch')

export const getSmartWeek = (target: HTMLElement) =>
  parseInt(target.getAttribute('data-week'), 10)
