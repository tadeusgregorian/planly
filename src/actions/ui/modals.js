//@flow
//import type { ThunkAction } from 'types/index'
import NotesPopup from 'components/popups/notesPopup'

export type OpenModal  = (string, ReactClass<*>, ?{})=>{}
export type CloseModal = (string)=>{}

export const openModal: OpenModal = (modalID, component, props) => ({
  type: 'OPEN_MODAL',
  payload: { modalID, component, props }
})

export const closeModal: CloseModal = (modalID) => ({ type: 'CLOSE_MODAL', payload: modalID })

export const openNotesModal = (props: {day: string, user?: string, type: 'shiftNote' | 'dayNote'}) =>
  openModal('notes', NotesPopup, props)
