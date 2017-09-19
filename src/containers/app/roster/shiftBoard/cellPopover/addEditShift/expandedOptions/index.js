//@flow
import React from 'react'
import type { ShiftCell } from 'types/index'
//import { getPosition } from './localHelpers'
import './styles.css'

type Props = {
  cell: ShiftCell,
  openNotesModal: ({})=>{}
}

export default (props: Props) => {

  const { day, user } = props.cell
  const notesClicked = () => props.openNotesModal({ day, user, type: 'shiftNote' })

  return(
    // <fb className="expandedOptionsMain" style={getPosition(props.cell)}>
    <fb className="expandedOptionsMain">
      <fb className='optionsButton' onClick={notesClicked} >Notiz</fb>
      <fb className='optionsButton'>Krank gemeldet</fb>
      <fb className='optionsButton'>Extrastunden</fb>
    </fb>
  )
}
