//@flow
//import type { ThunkAction } from 'types/index'
import ShiftNoteModal from 'components/modals/shiftNoteModal'

export type OpenModal  = (string, ReactClass<*>, ?{})=>{}
export type CloseModal = (string)=>{}

export const openModal: OpenModal = (modalID, component, props) => ({
  type: 'OPEN_MODAL',
  payload: { modalID, component, props }
})

export const closeModal: CloseModal = (modalID) => ({ type: 'CLOSE_MODAL', payload: modalID })


export const openNotesModal = (note: string, saveNote:(string)=>void) =>
  openModal('notes', ShiftNoteModal, {note, saveNote})
