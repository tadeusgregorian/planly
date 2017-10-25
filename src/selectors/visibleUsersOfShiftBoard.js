//@flow
import { createSelector } from 'reselect'
import type { User, Store, Shift } from 'types/index'

const getUsers            = (state: Store) => state.core.users
const getCurrentBranch    = (state: Store) => state.ui.roster.currentBranch
const getNonWorkersHidden = (state: Store) => state.ui.roster.shiftBoard.nonWorkersHidden
const getShifts           = (state: Store) => state.roster.shiftWeek
//const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID // need it to hide deleted users


const getVisibleUsers = ( users: Array<User>, currentBranch: string, nonWorkersHidden: boolean, shifts:Array<Shift> ): Array<User> => {
  return users.filter(u =>
    u.branches[currentBranch] && (!nonWorkersHidden || shifts.find(s => s.user === u.id))
  )
}

export default createSelector([getUsers, getCurrentBranch, getNonWorkersHidden, getShifts], getVisibleUsers)
