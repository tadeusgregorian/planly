//@flow
import { createSelector } from 'reselect'
import _ from 'lodash'
import type { User, Store, Shift, Position } from 'types/index'

const getUsers            = (state: Store) => state.core.users
const getPositions        = (state: Store) => state.core.positions
const getCurrentBranch    = (state: Store) => state.ui.roster.currentBranch
const getNonWorkersHidden = (state: Store) => state.ui.roster.shiftBoard.nonWorkersHidden
const getShifts           = (state: Store) => state.roster.shiftWeek
//const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID // need it to hide deleted users


const getVisibleUsers = ( users: Array<User>, positions: Array<Position>, currentBranch: string, nonWorkersHidden: boolean, shifts:Array<Shift> ): Array<User> => (

  _.sortBy(users, [getPosNrOfUser(positions), 'name' ])
  .filter(u => {
    if(shifts.find(s => s.user === u.id && s.branch === currentBranch)) return true
    if(u.deleted) return false
    return (!nonWorkersHidden) && u.branches[currentBranch]
  })
)

export default createSelector([getUsers, getPositions, getCurrentBranch, getNonWorkersHidden, getShifts], getVisibleUsers)


// curried funcition: sortBy takes a fun that accepts the element to sort by ( User in this case )
const getPosNrOfUser = (positions: Array<Position>) => (user: User) => {
  const pos = positions.find(p => p.id === user.position)
  return pos ? pos.nr : 100 // if something wrong here, just 100, shouldnt reach that...
}
