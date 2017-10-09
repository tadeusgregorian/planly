//@flow
import { combineReducers } from 'redux'
import modals from './modals'
import roster from './roster'
import absence from './absence'
import type { Roster } from './roster'
import type { Modals } from './modals'
import type { Absence } from './absence'


export type Ui = {
  roster: Roster,
  absence: Absence,
  modals: Modals
}

export default combineReducers({
  modals,
  absence,
  roster,
})
