//@flow
import { closest } from 'helpers/general'

export const getPosOfElement = (el: HTMLElement) => {
  const top         = el.offsetTop
  const left        = el.offsetLeft
  const width       = el.offsetWidth
  const height      = el.offsetHeight
  return { top, left, width, height }
}

const elementIsColorPicker = (el: HTMLElement): boolean =>
  !!(el.getAttribute && el.getAttribute('data-type') === 'color-picker')

export const isInsideColorPicker = (el: HTMLElement): boolean => {
  const colorPicker = closest(el, (element) => elementIsColorPicker(element))
  return !!colorPicker
}
