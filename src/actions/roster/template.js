//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { generateGuid } from 'helpers/index'
import { toDBShift, getMini, fetchTemplateWeek } from './localHelpers'
import type { GetState, ThunkAction, Shift } from 'types/index'

  export const savelWeekAsTemplate: ThunkAction = (name: string) => (dispatch, getState: GetState) => {
  const branch    = getState().ui.roster.currentBranch
  const shifts    = getState().roster.shiftWeek

  const tempID    = generateGuid()
  const flatTemp  = { id: tempID, name, branch }
  const tempWeek  = createTemplateWeek(shifts, branch)

  const update1 =  {[getFBPath('templatesFlat',  [tempID])]:  flatTemp}
  const update2 =  {[getFBPath('shiftWeeks',     [tempID])]:  tempWeek}

  db().ref().update({ ...update1, ...update2})
  dispatch({ type: 'ENTER_TEMPLATE_MODE', payload: tempID })
}

export const saveTemplateName = (tempID: string, name: string) => {
  const path    = getFBPath('templatesFlat')
  db().ref(path).child(tempID).child('name').set(name)
}

export const createNewTemplate: ThunkAction = (name: string) => (dispatch, getState: GetState) => {
  const branch    = getState().ui.roster.currentBranch
  const tempID    = generateGuid()
  const flatTemp  = { id: tempID, name, branch }
  db().ref(getFBPath('templatesFlat')).child(tempID).set(flatTemp)
  dispatch({ type: 'SET_CURRENT_WEEK_ID', payload: tempID })
}

export const importTemplateWeek: ThunkAction = (tempID: string) => (dispatch, getState: GetState) => {
  const weekID  = getState().ui.roster.currentWeekID

  return fetchTemplateWeek(tempID).then(shifts => {
    const updates = {}
    shifts.forEach(s => updates[getFBPath('miniShiftWeeks', [weekID, s.user, s.id])] = getMini(s))
    shifts.forEach(s => updates[getFBPath('shiftWeeks',     [weekID, s.id])]         = s)
    return db().ref().update(updates)
  })
}

const createTemplateWeek = (shifts: Array<Shift>, branch: string): {[id: string]: Shift} => {
  const tempWeek = {}
  shifts.forEach(s => tempWeek[s.id] = { ...s, edit: null }) // dont want no edits in the template
  return tempWeek
}
