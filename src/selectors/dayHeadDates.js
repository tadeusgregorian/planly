//@flow
import { createSelector } from 'reselect'
import moment from 'moment'
import { weekDays } from 'constants/roster'
import { getYear, getWeek } from 'helpers/roster'
import type { Store } from 'types/index'

const getCurrentWeekID      = (state: Store) => state.ui.roster.currentWeekID
const getTemplateMode       = (state: Store) => state.ui.roster.templateMode

const getDayHeadDates = (weekID: string, tempMode: boolean): Array< ?moment > => {
  if(tempMode) return [null, null, null, null, null, null, null]

  const year = getYear(weekID)
  const week = getWeek(weekID)
  return weekDays.map((wd, i) => moment().weekYear(year).week(week).weekday(i))
}

export default createSelector([getCurrentWeekID, getTemplateMode], getDayHeadDates)
