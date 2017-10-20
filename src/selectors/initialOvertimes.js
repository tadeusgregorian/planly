//@flow
import { createSelector } from 'reselect'
import type { User, Correction } from 'types/index'

const getUsers          = (state: Store) => state.core.users
const getCorrections    = (state: Store) => state.roster.corrections

const getInitialOvertimes = (users: Array<User>, corrections: Array<Correction>)=>{


}

export default createSelector([getUsers, getCorrections], getInitialOvertimes)
