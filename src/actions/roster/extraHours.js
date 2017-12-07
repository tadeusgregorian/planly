//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { ExtraHours, ExtraHoursDB, GetState, ThunkAction } from 'types/index'
import { updateWeekSums } from './weekSums'

export const saveExtraHoursToDB:ThunkAction = (extraHours: ExtraHours, deleteIt = false) => (disp, getState: GetState) => {
  const { id } = extraHours
  const branch         = getState().ui.roster.currentBranch
  const weekID         = getState().ui.roster.currentWeekID
  const extraHoursDB   = extendExtraHours(extraHours, branch)
  //const extraHoursObj  = {  }

  const update1 = {[ getFBPath('extraHours',     [weekID, id]) ]:       deleteIt ? null : extraHoursDB }
  const update2 = updateWeekSums(getState, { extraHours: [extraHours] }, deleteIt)
  db().ref().update( { ...update1, ...update2 })
}

const extendExtraHours = (extraHours: ExtraHours, branch): ExtraHoursDB =>{
  const branchDay = branch + extraHours.day
  return { ...extraHours, branch, branchDay }
}
