//@flow
import { createSelector } from 'reselect'
import type { Branch, Store } from 'types/index'

const getBranches     = (state: Store) => state.core.branches

const getActiveBranches = (branches: Array<Branch>): Array<Branch> => (
  branches.filter(b => !b.deleted)
)

export default createSelector([getBranches], getActiveBranches)
