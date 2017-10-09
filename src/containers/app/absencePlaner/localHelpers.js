//@flow
/* eslint-disable no-use-before-define */

import { closestWithAttribute } from 'helpers/index'

export const getClickedUserID = (e: any) => {
  const userNode = closestWithAttribute(e.target, 'data-type', 'absence-user')
  return userNode && userNode.getAttribute('data-user')
}

export const getClickedAbsenceID = (e: any) => {
  const absenceBarNode = closestWithAttribute(e.target, 'data-type', 'absence-bar')
  return absenceBarNode && absenceBarNode.getAttribute('data-absence-id')
}
