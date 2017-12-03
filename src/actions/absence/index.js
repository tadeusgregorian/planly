// @flow

import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { Absence, AbsenceCorrection } from 'types/index'

export const saveAbsenceToDB = (absence: Absence) => {
  const request = absence.status === 'requested' ? absence : null // delete just in case...
  const updates = {}

  updates[getFBPath('absences', [absence.id])] = absence
  updates[getFBPath('vacationRequests', [absence.id])] = request

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
