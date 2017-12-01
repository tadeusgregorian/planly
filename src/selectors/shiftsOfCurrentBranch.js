//@flow
import { createSelector } from 'reselect'

import type { Store, Shift } from 'types/index'

const getCurrentBranch    = (state: Store) => state.ui.roster.currentBranch
const getCurrentShiftWeek = (state: Store) => state.roster.shiftWeek

const getShiftsOfCurrentBranch = (currentBranch: string, shifts: Array<Shift> ): Array<Shift> => {
  return shifts.filter(s => s.branch === currentBranch)
}

export default createSelector([ getCurrentBranch, getCurrentShiftWeek ], getShiftsOfCurrentBranch)
