//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { DayNote , GetState, ThunkAction } from 'types/index'

export const saveDayNoteToDB:ThunkAction = (dayNote: DayNote, deleteIt = false) => (disp, getState: GetState) => {

  const branch         = getState().ui.roster.currentBranch
  const weekID         = getState().ui.roster.currentWeekID
  const dbDayNote      = { ...dayNote, branch }
  const path           = getFBPath('dayNotes', [weekID])

  db().ref(path).child(dayNote.id).set(deleteIt ? null : dbDayNote)
}
