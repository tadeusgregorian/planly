import { closest } from 'helpers/index'

export const isInsidePopover = (target: HTMLElement) =>
  !!closest(target, (t) => { return (
    t.getAttribute && t.getAttribute('data-type') === 'vac-req-pop'
  )})
