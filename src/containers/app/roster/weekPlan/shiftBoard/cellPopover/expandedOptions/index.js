//@flow
import React from 'react'
import { connect } from 'react-redux'
import { openModal } from 'actions/ui/modals'
import type { OpenModal } from 'actions/ui/modals'
import type { Shift, FocusedCell } from 'types/index'
import { getPosition } from './localHelpers'
import NotesPopup from 'components/popups/notesPopup'
import './styles.css'

type Props = { shift: Shift, cell: FocusedCell, openModal: OpenModal }

const ExpandedOptions = (props: Props) => {

  return(
    <fb className="expandedOptionsMain" style={getPosition(props.cell)}>
      <fb className='optionsButton' onClick={() => props.openModal('notesModal', NotesPopup)} >Notiz</fb>
      <fb className='optionsButton'>Krankmeldung</fb>
      <fb className='optionsButton'>Extrastunden</fb>
    </fb>
  )
}

const actionsToProps = {
  openModal
}

export default connect(null, actionsToProps)(ExpandedOptions)
