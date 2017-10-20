//@flow
import { db } from '../firebaseInit'
import { getFBPath } from './../actionHelpers'
import type { Correction } from 'types/index'

export const saveCorrectionToDB = (correction: Correction) => {
  const path    = getFBPath('corrections')
  const key     = correction.user + correction.week
  db().ref(path).child(key).set(correction)
}
