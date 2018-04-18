//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { generateGuid } from 'helpers/index'
import { fetchTemplateWeek } from './localHelpers'
import { saveShiftToDB } from './index';
import type { GetState, ThunkAction } from 'types/index'

export const saveWeekAsTemplate: ThunkAction = (name: string) => (dispatch, getState: GetState) => {
  const branch = getState().ui.roster.currentBranch
  const shifts = getState().roster.shiftWeek.filter(s => s.branch === branch ) // shifts contains shifts of all branches ! -> need to filter here!

  const tempID      = generateGuid()
  const flatTemp    = { id: tempID, name, branch }
  const shiftsTemp  = shifts.map(s => ({ ...s, id: generateGuid(), edit: null }))

  const flatTempUpdate =  {[getFBPath('templatesFlat',  [tempID])]:  flatTemp}

  return saveShiftToDB({
    shifts: shiftsTemp,
    isTemplate: true,
    weekID: tempID,
    otherUpdate: flatTempUpdate
  })(dispatch, getState)
  //dispatch({ type: 'ENTER_TEMPLATE_MODE', payload: tempID })
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
  return fetchTemplateWeek(tempID).then(shifts => {
    const shiftsCopy = shifts.map(s => ({ ...s, id: generateGuid() }))
    return saveShiftToDB({ shifts: shiftsCopy })(dispatch, getState)
  })
}
