//@flow
import { createSelector } from 'reselect'
import type { User } from 'types/index'

const getCurrentUser = (state) => state.auth.currentUserID
const getUsers 	     = (state) => state.core.users

const getCurrentUserObj = (currentUser, users: Array<User>): ?User => {
  return users.find(u => u.id === currentUser)
}

export default createSelector([getCurrentUser, getUsers], getCurrentUserObj)
