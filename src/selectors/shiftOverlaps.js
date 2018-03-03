//@flow
import { createSelector } from 'reselect'

import type { Store, Shift, Branch } from 'types/index'

const branches = (state: Store) => state.core.branches
const shifts = (state: Store) => state.roster.shiftWeek

const getShiftOverlaps = (branches: Array<Branch>, shifts: Array<Shift> ): {} => {
  if(!branches.length ||! shifts.length) return {} // data not yet loaded

  const overlaps = {}

  shifts.forEach(s => {
    const shiftsToCheck = shifts.filter( shift => 
      shift.day === s.day &&
      shift.user === s.user &&
      shift.user !== 'open')

    shiftsToCheck.forEach( shift => {
      if(shiftsOverlap(s, shift) && (s.id !== shift.id)) {
        const branch: Branch = (branches.find(b => b.id === shift.branch): any)
        overlaps[s.id] = branch.name
      }
    })
  })

  return overlaps
}

const shiftsOverlap = (shift1: Shift, shift2: Shift): boolean =>
  shift1.s < shift2.e && shift1.e > shift2.s

export default createSelector([ branches, shifts ], getShiftOverlaps)
