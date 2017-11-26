// @flow

import moment from 'moment'
import values from 'lodash/values'
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { momToSmart } from 'helpers/index'
import { extendForDB, rangesOverlap } from './localHelpers'
import type { AbsencePreDB, Absence, AbsenceCorrection } from 'types/index'

export const saveAbsenceToDB = (absence: AbsencePreDB) => {
  const absenceDB = extendForDB(absence)
  const request = absence.status === 'requested' ? absenceDB : null // delete just in case...
  const updates = {}

  updates[getFBPath('absences', [absence.id])] = absenceDB
  updates[getFBPath('vacationRequests', [absence.id])] = request

  //console.log(JSON.stringify(absenceDB));
  db().ref().update(updates)
}

export const removeAbsenceFromDB = (absenceID: string) => {
  const updates = {[getFBPath('absences', [absenceID])]: null }
  updates[getFBPath('vacationRequests', [absenceID])] = null // cleaning it away, just in case
  db().ref().update(updates)
}

export const saveAbsenceCorrectionToDB = (absCorr: AbsenceCorrection) => {
  const path = getFBPath('absenceCorrections')
  db().ref(path).child(absCorr.id).set(absCorr)
}


export const checkOverlappings = (start: moment, end: moment, user: string, absenceID: string): Promise<boolean> => {
  const year       = start.year()
  const path       = getFBPath('absences')
  const queryRef   = db().ref(path).orderByChild('yearUser').equalTo(year + user)
  const startSmart = momToSmart(start)
  const endSmart   = momToSmart(end)

  return queryRef.once('value').then( snap => {

    const absences: Array<Absence> =  snap.val() ? values(snap.val()) : []
    const itOverlaps = absences.reduce(
      (acc, val) =>
        (
          absenceID !== val.id && // otherwiese it overlaps with itselefe when editing Absence.
          rangesOverlap(val.startDate, val.endDate, startSmart, endSmart)
        ) || acc,
      false
    )
    return itOverlaps
  })
}
