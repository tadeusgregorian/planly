//@flow
import {weekIDToMoment} from 'helpers/roster';
import {momToSmart} from 'helpers/index';
import {weekDays} from 'constants/roster';
import { db } from '../firebaseInit'
import omit from 'lodash/omit'
import { getFBPath } from './../actionHelpers'
import type { ExtraHours, ExtraHoursDB, GetState, ThunkAction } from 'types/index'
import { updateWeekSums } from './weekSums'

export const saveExtraHoursToDB:ThunkAction = (extraHours: ExtraHours, deleteIt = false) => (disp, getState: GetState) => {
  const branch         = getState().ui.roster.currentBranch
  const weekID         = getState().ui.roster.currentWeekID
  const extraHoursDB   = extendExtraHours(extraHours, branch)

  const update1 = {[ getFBPath('extraHours',     [weekID, extraHours.id]) ]:       deleteIt ? null : extraHoursDB }
  const update2 = updateWeekSums(getState, { extraHours: [extraHours] }, deleteIt)
  const update3 = getExtraHoursPMUpdate(extraHours, weekID, branch, deleteIt)

  db().ref().update( { ...update1, ...update2, ...update3 })
}

const extendExtraHours = (extraHours: ExtraHours, branch): ExtraHoursDB =>{
  const branchDay = branch + extraHours.day
  return { ...extraHours, branch, branchDay }
}

export const getExtraHoursPMUpdate = (extraHours: ExtraHours, weekID: string , branch: string, remove: boolean = false) => {
  const eh      = omit({ ...extraHours, branch }, ['branchDay'])
  eh.date       = momToSmart(weekIDToMoment(weekID).weekday(weekDays.indexOf(extraHours.day)))
  const smartMonth = eh.date.toString().substr(0,6)
  const data      = remove ? null : eh
  return  {[ getFBPath('extraHoursPM', [smartMonth, eh.id]) ]: data }
}
