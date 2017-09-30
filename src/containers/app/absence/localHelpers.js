//@flow
/* eslint-disable no-use-before-define */

import { closestWithAttribute } from 'helpers/general'

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
