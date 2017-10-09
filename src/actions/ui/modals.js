//@flow
import ShiftNoteModal from 'components/modals/shiftNoteModal'
import AbsenceModal from 'components/modals/absenceModal'
import type { Absence } from 'types/index'

export type OpenModal  = (string, ReactClass<*>, ?{})=>{}
export type CloseModal = (string)=>{}

export const openModal: OpenModal = (modalID, component, props) => ({
  type: 'OPEN_MODAL',
  payload: { modalID, component, props }
})

export const closeModal: CloseModal = (modalID) => ({
  type: 'CLOSE_MODAL',
  payload: modalID
})

export const openNotesModal = (note: string, saveNote:(string)=>void) =>
  openModal('notes', ShiftNoteModal, {note, saveNote})

export const openAbsenceModal = (userID: string, absence?: Absence) =>
  openModal('absence', AbsenceModal, { userID, absence })
