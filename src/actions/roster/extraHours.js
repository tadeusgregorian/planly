//@flow
import {weekIDToMoment} from 'helpers/roster';
import {momToSmart} from 'helpers/index';
import {weekDays} from 'constants/roster';
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { ExtraHours, ExtraHoursDB, GetState, ThunkAction } from 'types/index'
import {getWeekSumsRequestUpdate} from './localHelpers';
import { updateWeekSums } from './weekSums'

export type SaveExtraHoursToDBParams = {
  extraHours: Array<ExtraHours>,
  deleteIt?: boolean,
  isTemplate?: boolean,
  branch?: string,
  weekID?: string
}

export const saveExtraHoursToDB:ThunkAction = (params: SaveExtraHoursToDBParams) => (disp, getState: GetState) => {
  const { extraHours, deleteIt } = params
  const branch         = params.branch || getState().ui.roster.currentBranch
  const weekID         = params.weekID || getState().ui.roster.currentWeekID
  const isTemplate     = params.isTemplate || getState().ui.roster.templateMode

  let weekSumUpdates = getState().auth.clientDevice === 'DESKTOP'
    ? updateWeekSums(getState, { extraHours }, deleteIt) // on Desktop: we update weekSums actively
    : getWeekSumsRequestUpdate(extraHours.map(eh => eh.user), weekID) // on Mobile: we create request for a cloudFunction to update weekSums, because we dont download the whole shiftWeek on Mobile

  let EHUpdates, EHListUpdates   = {}

  extraHours.forEach(eh => EHUpdates = { ...EHUpdates,  ...getEHUpdate(eh, weekID, branch, deleteIt) })
  extraHours.forEach(eh => EHListUpdates = { ...EHListUpdates, ...getEHListUpdate(eh, weekID, branch, deleteIt, isTemplate)} )

  return db().ref().update( { ...EHUpdates, ...EHListUpdates, ...weekSumUpdates })
}

export const getEHUpdate = (extraHours: ExtraHours, weekID: string , branch: string, remove: ?boolean = false) => {
  const data = remove ? null : extendExtraHours(extraHours, branch)
  return {[ getFBPath('extraHours', [weekID, extraHours.id])]: data}
}

const extendExtraHours = (extraHours: ExtraHours, branch: string): ExtraHoursDB =>{
  const branchDay = branch + extraHours.day
  return { ...extraHours, branch, branchDay }
}

const getEHListUpdate = (
  extraHours: ExtraHours,
  weekID: string,
  branch: string,
  remove?: boolean = false,
  isTemplate?: boolean = false,
) => {
  const eh       = { ...extraHours, branch }
  const mom      = !isTemplate && weekIDToMoment(weekID).weekday(weekDays.indexOf(extraHours.day))

  eh.weekID      = weekID
  eh.date        = (isTemplate || !mom) ? null : momToSmart(mom) // templateShift has no date -> marked as null
  eh.monthID     = (isTemplate || !eh.date) ? null : eh.date.toString().substr(0,6) // templateShift has no date -> marked as null
  eh.userMonthID = (isTemplate || !eh.monthID) ? null : eh.user + '_' + eh.monthID

  return  {[ getFBPath('extraHoursList', [eh.id]) ]: remove ? null : eh }
}
