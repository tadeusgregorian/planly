//@flow
import type { Absence } from 'types/index'

export type OpenModal  = (string, ?{})=>{}
export type CloseModal = (string)=>{}

export const openModal: OpenModal = (modalID, props) => ({
  type: 'OPEN_MODAL',
  payload: { modalID, props }
})

export const closeModal: CloseModal = (modalID) => ({
  type: 'CLOSE_MODAL',
  payload: modalID
})

export const openNotesModal = (note: string, saveNote:(string)=>void) =>
  openModal('SHIFT_NOTE', {note, saveNote})

export const openAbsenceModal = (userID: string, absence?: Absence) =>
  openModal('ABSENCE', { userID, absence })
