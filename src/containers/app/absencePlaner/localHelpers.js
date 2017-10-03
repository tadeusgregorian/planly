//@flow
/* eslint-disable no-use-before-define */

import { closestWithAttribute, smartToMom } from 'helpers/general'
import type { Absence } from 'types/index'

//superdirty im sorry
export const handleClicks = (openAbsenceModal?: Function) => {
  const somethingGotClicked = (e: any) => {
    const clickedUser = closestWithAttribute(e.target, 'data-type', 'absence-user')
    const userID = clickedUser && clickedUser.getAttribute('data-user')
    userID && openAbsenceModal && openAbsenceModal(userID)
  }

  openAbsenceModal && document.addEventListener('click', somethingGotClicked)
  !openAbsenceModal && document.removeEventListener('click', somethingGotClicked)
}

export const absencesOfMonth = (absences: Array<Absence>, month: number): Array<Absence> => {
  return absences.filter(a => {
    const monthStart = smartToMom(a.startDate).month()
    const monthEnd = smartToMom(a.endDate).month()
    return (monthStart === month || monthEnd === month)
  })
}
