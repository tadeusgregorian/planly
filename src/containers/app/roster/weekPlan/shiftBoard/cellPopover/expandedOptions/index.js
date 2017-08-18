//@flow
import React from 'react'
import type { FocusedCell } from 'types/index'
import type { NoteModalProps } from 'actions/ui/modals'
import { getPosition } from './localHelpers'
import './styles.css'

type Props = { cell: FocusedCell, openNotesModal: (NoteModalProps)=>{} }

export default (props: Props) => {

  const { day, user } = props.cell
  const notesClicked = () => props.openNotesModal({ day, user, type: 'shiftNote' })

  return(
    <fb className="expandedOptionsMain" style={getPosition(props.cell)}>
      <fb className='optionsButton' onClick={notesClicked} >Notiz</fb>
      <fb className='optionsButton'>Krankmeldung</fb>
      <fb className='optionsButton'>Extrastunden</fb>
    </fb>
  )
}
