//@flow
import { createSelector } from 'reselect'
import type { User, Correction } from 'types/index'

const getUsers          = (state: Store) => state.core.users
const getCorrections    = (state: Store) => state.roster.corrections

const getInitialStartWeeks = (users: Array<User>, corrections: Array<Correction>): {[string]: string} =>{
  const initialStartWeeks = {}
  corrections.forEach(c => {
    c.initial && (initialStartWeeks[c.user] = c.week )
  })
  return initialStartWeeks
}

export default createSelector([getUsers, getCorrections], getInitialStartWeeks)
