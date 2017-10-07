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
  console.log(absenceDB);
  db().ref(getFBPath('absences', [absenceDB.id])).set(absenceDB)
}

export const removeAbsenceFromDB = (absenceID: string) => {
  db().ref(getFBPath('absences', [absenceID])).set(null)
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
