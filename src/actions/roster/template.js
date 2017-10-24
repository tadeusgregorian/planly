//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { generateGuid } from 'helpers/index'
import { toDBShift } from './localHelpers'
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

const createTemplateWeek = (shifts: Array<Shift>, branch: string): {[id: string]: Shift} => {
  const tempWeek = {}
  shifts.forEach(s => {
    const dbShift = toDBShift({ ...s, branch, edit: null }) // we dont want edits in the templateWeek.
    tempWeek[s.id] = dbShift
  })
  return tempWeek
}
