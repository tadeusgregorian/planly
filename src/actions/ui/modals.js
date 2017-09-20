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

export type NoteModalProps = {day: string, user?: string, type: 'shiftNote' | 'dayNote'}
export const openNotesModal = (props: NoteModalProps) => {
  openModal('notes', NotesPopup, props)
}
