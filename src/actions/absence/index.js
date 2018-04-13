// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { extendForDB } from './localHelpers'
import type { Absence, AbsenceCorrection, User } from 'types/index'

export const saveAbsenceToDB = (user: User, absence: Absence) => {
  const request = absence.status === 'requested' ? absence : null // delete just in case...
  const updates = {}

  updates[getFBPath('absences', [absence.id])] = extendForDB(user, absence)
  updates[getFBPath('vacationRequests', [absence.id])] = request

  console.log(extendForDB(user, absence))

  db().ref().update(updates)
}

export const removeAbsenceFromDB = (absenceID: string) => {
  const updates = {[getFBPath('absences', [absenceID])]: null }
  updates[getFBPath('vacationRequests', [absenceID])] = null // cleaning it away, just in case there is a req
  db().ref().update(updates)
}

export const saveAbsenceCorrectionToDB = (absCorr: AbsenceCorrection) => {
  const path = getFBPath('absenceCorrections')
  db().ref(path).child(absCorr.id).set(absCorr)
}
