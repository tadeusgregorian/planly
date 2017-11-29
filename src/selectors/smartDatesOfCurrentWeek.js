//@flow
import { createSelector } from 'reselect'
import { weekDays } from 'constants/roster'
import { weekIDToMoment } from 'helpers/roster'
import { momToSmart } from 'helpers/index'

import type { Store } from 'types/index'

const getCurrentWeekID  = (state: Store) => state.ui.roster.currentWeekID

const getSmartDatesOfCurrentWeek = (weekID: string ): Array<number> => {
  return weekDays.map((we, i) =>  momToSmart(weekIDToMoment(weekID).weekday(i)))
}

export default createSelector([ getCurrentWeekID ], getSmartDatesOfCurrentWeek)
