export const unfocusShift = () => ({
  type: 'UNFOCUS_SHIFT_MOB'
})

export const focusShift = (shiftID: string) => ({
  type: 'FOCUS_SHIFT_MOB',
  payload: shiftID
})
