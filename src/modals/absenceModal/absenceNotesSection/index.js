//@flow
import React, { PureComponent } from 'react'
import './styles.css'

type Props = {
  note: ?string,
  changeNote: (string)=>any
}

export default class AbsenceNotesSection extends PureComponent{
  props: Props

  render(){
    const { note, changeNote } = this.props

    return(
        <fb className="absenceNotesSectionMain">
          <fb className='label'>Notiz</fb>
          <textarea className='inp' type='text' value={note} onChange={(e)=>changeNote(e.target.value)} />
        </fb>
    )
  }
}
