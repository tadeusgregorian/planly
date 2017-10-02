// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { ThunkAction, AbsencePreDB } from 'types/index'


export const saveAbsenceToDB:ThunkAction = (absence: AbsencePreDB) => (disp) => {
  db().ref(getFBPath('absence', [absence.id])).set(absence)
}
