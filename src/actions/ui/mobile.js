//@flow

export const unfocusShift = () => ({
  type: 'UNFOCUS_SHIFT_MOB'
})

export const focusShift = (shiftID: string) => ({
  type: 'FOCUS_SHIFT_MOB',
  payload: shiftID
})

export const openSnackBar = ({ type, text }: { type: string, text: string  }) => ({
  type: 'OPEN_SNACK_BAR_MOB',
  payload: { type, text }
})

export const closeSnackBar = () => ({
  type: 'CLOSE_SNACK_BAR_MOB'
})
