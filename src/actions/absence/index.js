// @flow

import moment from 'moment'
import _ from 'lodash'
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { momToSmart } from 'helpers/index'
import { extendForDB, rangesOverlap } from './localHelpers'
import type { AbsencePreDB, Absence } from 'types/index'

export const saveAbsenceToDB = (absence: AbsencePreDB) => {
  const absenceDB = extendForDB(absence)
  const request = absence.status === 'requested' ? absenceDB : null // delete just in case...
  const updates = { [getFBPath('absences', [absence.id])]: absenceDB }
  updates[getFBPath('vacationRequests', [absence.id])] = request

  db().ref().update(updates)
}

export const removeAbsenceFromDB = (absenceID: string) => {
  const updates = {[getFBPath('absences', [absenceID])]: null }
  updates[getFBPath('vacationRequests', [absenceID])] = null // cleaning it away, just in case
  db().ref().update(updates)
}


export const checkOverlappings = (start: moment, end: moment, user: string): Promise<boolean> => {
  const year       = start.year()
  const path       = getFBPath('absences')
  const queryRef   = db().ref(path).orderByChild('yearUser').equalTo(year + user)
  const startSmart = momToSmart(start)
  const endSmart   = momToSmart(end)

  return queryRef.once('value').then( snap => {

    const absences: Array<Absence> =  snap.val() ? _.values(snap.val()) : []
    const itOverlaps = absences.reduce(
      (acc, val) => rangesOverlap(val.startDate, val.endDate, startSmart, endSmart) || acc,
      false
    )
    return itOverlaps
  })
}
