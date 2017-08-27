//@flow

import { combineReducers } from 'redux'
import modals from './modals'
import roster from './roster'
import type { Roster } from './roster'
import type { Modals } from './modals'


export type Ui = {
  roster: Roster,
  modals: Modals
}

export default combineReducers({
  modals,
  roster
})
