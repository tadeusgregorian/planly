// @flow

import moment from 'moment'
import _ from 'lodash'
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import { momToSmart } from 'helpers/general'
import { getTouchingWeeks, extendForDB } from './localHelpers'
import type { ThunkAction, AbsencePreDB, Absence } from 'types/index'

const rangesOverlap = (xS: number, xE: number, yS:number, yE:number): boolean => {
  return yS <= xE && yE >= xS
}

export const saveAbsenceToDB:ThunkAction = (absence: AbsencePreDB) => (disp) => {
  const updates = {}
  const absenceDB = extendForDB(absence)

  updates[ getFBPath('absences', [absenceDB.id])] = absenceDB
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
