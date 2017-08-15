// @flow

import { db } from '../firebaseInit'
import { getFirebasePath } from './../actionHelpers'
import type { PreDBShift } from 'types/index'

const glue = (str1: string, str2: string ): string => str1 + str2

export const removeShiftWeek = () => ({type: 'remove_shiftWeek'})

const extendShiftForDB = (sh: PreDBShift) => ({
  ...sh, branchDay: glue(sh.branch, sh.day), userDay: glue(sh.user, sh.day)
})

export const writeShiftToDB = (smartWeek: string, shift: PreDBShift) => {
  console.log(extendShiftForDB(shift))
}

export const createDummyShift = () => {
  const dummy = {s: 200, e: 500, b: 30, user: 'u003', day: 'mo', branch: 'b001', userDay: 'u003mo', branchDay: 'b001mo'}

  db().ref(getFirebasePath('shiftWeeks')).child('201735/b001u003mo').set(dummy)
}
