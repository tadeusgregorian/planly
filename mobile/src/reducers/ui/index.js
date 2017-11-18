//@flow
import { combineReducers } from 'redux'
import roster from './roster'
import { simpleReducer } from '../reducerHelpers'
import type { SideNav } from 'types/index'
import type { Roster } from './roster'

const sideNav = simpleReducer({
  default: null,
  OPEN_SIDE_NAV: 'PAYLOAD',
  CLOSE_SIDE_NAV: null,
  SET_CURRENT_BRANCH: null,
})

export type Ui = {
  roster: Roster,
  sideNav: SideNav,
}

export default combineReducers({
  roster,
  sideNav,
})
