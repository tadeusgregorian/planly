//@flow
import { combineReducers } from 'redux'
import modals from './modals'
import roster from './roster'
import absence from './absence'
import mobile from './mobile'
import sideNav from './sideNav' // Mobile
import type { Mobile } from './mobile'
import type { Roster } from './roster'
import type { Modals } from './modals'
import type { Absence } from './absence'
import type { SideNav } from 'types/index'



export type Ui = {
  roster: Roster,
  absence: Absence,
  modals: Modals,
  sideNav: SideNav, // Mobile
  mobile: Mobile,
}

export default combineReducers({
  modals,
  absence,
  roster,
  sideNav, // Mobile
  mobile
})
