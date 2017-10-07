//@flow
/* eslint-disable no-use-before-define */

import { closestWithAttribute, smartToMom } from 'helpers/index'
import type { Absence, AbsenceTypeFilter } from 'types/index'

//superdirty im sorry
export const handleClicks = (isMounting: boolean, openAbsenceModal: Function) => {
  const somethingGotClicked = (e: any) => {
    const userNode = closestWithAttribute(e.target, 'data-type', 'absence-user')
    const absenceBarNode = closestWithAttribute(e.target, 'data-type', 'absence-bar')

    if(userNode){
      const userID = userNode.getAttribute('data-user')
      openAbsenceModal(userID)
    }

    if(absenceBarNode){
      const userID    = absenceBarNode.getAttribute('data-user')
      const absenceID = absenceBarNode.getAttribute('data-absence-id')
      openAbsenceModal(userID, absenceID)
    }
  }

  isMounting && document.addEventListener('click', somethingGotClicked)
  !isMounting && document.removeEventListener('click', somethingGotClicked)
}

export const absencesFiltered = (absences: Array<Absence>, month: number, type: AbsenceTypeFilter): Array<Absence> => {
  return absences.filter(a => {
    if(type !== 'all' && type !== a.type) return false

    const monthStart = smartToMom(a.startDate).month()
    const monthEnd = smartToMom(a.endDate).month()
    return (monthStart === month || monthEnd === month)
  })
}
