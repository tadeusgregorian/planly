//@flow
/* eslint-disable no-use-before-define */

import { closestWithAttribute, smartToMom } from 'helpers/index'
import type { Absence, AbsenceTypeFilter } from 'types/index'

export const getClickedUserID = (e: any) => {
  const userNode = closestWithAttribute(e.target, 'data-type', 'absence-user')
  return userNode && userNode.getAttribute('data-user')
}

export const getClickedAbsenceID = (e: any) => {
  const absenceBarNode = closestWithAttribute(e.target, 'data-type', 'absence-bar')
  return absenceBarNode && absenceBarNode.getAttribute('data-absence-id')
}

export const absencesFiltered = (absences: Array<Absence>, month: number, type: AbsenceTypeFilter): Array<Absence> => {
  return absences.filter(a => {
    if(type !== 'all' && type !== a.type) return false

    const monthStart = smartToMom(a.startDate).month()
    const monthEnd = smartToMom(a.endDate).month()
    return (monthStart === month || monthEnd === month)
  })
}
