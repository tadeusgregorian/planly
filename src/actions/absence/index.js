// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { getTouchingWeeks } from './localHelpers'
import type { ThunkAction, AbsenceDB } from 'types/index'

export const saveAbsenceToDB:ThunkAction = (absence: AbsenceDB) => (disp) => {
  const updates = {}
  const touchingWeeks = getTouchingWeeks(absence)

  if(absence.status === 'accepted'){
    //touchingWeeks.forEach(w => updates[ getFBPath('touchingWeeks', [w, absence.id]) ] = absence.user )
  }

  updates[ getFBPath('absences', [absence.id])] = absence
  db().ref().update(updates)
}
