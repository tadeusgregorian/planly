//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { weekDays } from 'constants/roster'
import type { ExtraHours, ExtraHoursDB, GetState, ThunkAction } from 'types/index'

export const saveExtraHoursToDB:ThunkAction = (extraHours: ExtraHours, deleteIt = false) => (disp, getState: GetState) => {
  const { id, user, day, mins} = extraHours
  const branch         = getState().ui.roster.currentBranch
  const weekID         = getState().ui.roster.currentWeekID
  const extraHoursDB   = extendExtraHours(extraHours, branch)
  const mini           = { weekDay: weekDays.indexOf(day), mins }

  const update1 = {[ getFBPath('extraHours',     [weekID, id]) ]:       deleteIt ? null : extraHoursDB }
  const update2 = {[ getFBPath('miniShiftWeeks', [weekID, user, id]) ]: deleteIt ? null : mini }

  db().ref().update({ ...update1, ...update2 })
}


const extendExtraHours = (extraHours: ExtraHours, branch): ExtraHoursDB =>{
  const branchDay = branch + extraHours.day
  const userDay   = extraHours.user + extraHours.day
  return { ...extraHours, branch, branchDay, userDay }
}
