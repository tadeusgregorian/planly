//@flow
import { createSelector } from 'reselect'
import getSmartDatesOfCurrentWeek from './smartDatesOfCurrentWeek'

import type { Store, User, Absence, AbsenceType } from 'types/index'

const getUsers    = (state: Store) => state.core.users
const getAbsences = (state: Store) => state.absencePlaner.absences


export type AbsentDaysOfUsers = { [userID: string]: { [weekDay: number]: AbsenceType }} // -> object key is turned to string, but flow doesnt get it...
const getAbsentDaysOfUsers = (users: Array<User>, absences: Array<Absence>, smartDatesOfWeek: Array<number> ): AbsentDaysOfUsers => {
  const matrix: AbsentDaysOfUsers = {}

  users.forEach(user => {
    matrix[user.id] = {}

    smartDatesOfWeek.forEach((smartDate, weekDay) =>  {
      absences.filter(a => a.user === user.id).forEach(a => {
        a.startDate <= smartDate && a.endDate >= smartDate && (matrix[user.id][weekDay] = a.type)
      })
    })
  })

  return matrix
}

export default createSelector([ getUsers, getAbsences, getSmartDatesOfCurrentWeek ], getAbsentDaysOfUsers)
