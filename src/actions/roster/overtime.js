//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { Correction } from 'types/index'

export const saveCorrectionToDB = (correction: Correction) => {
  const path    = getFBPath('corrections')
  const key     = correction.user + '_' + correction.week
  db().ref(path).child(key).set(correction)
}

export const removeCorrectionFromDB = (user: string, week: string) => {
  const path    = getFBPath('corrections')
  const key     = user + '_' + week
  db().ref(path).child(key).set(null)
}
