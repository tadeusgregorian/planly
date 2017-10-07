//@flow
import React, { PureComponent } from 'react'
import Expander from 'components/expander'
import './styles.css'

type Props = {
  userNote: ?string,
  adminNote: ?string,
  changeAdminNote: (string)=>any,
  changeUserNote: (string)=>any,
  adminMode: boolean,
  expanded: boolean
}

export default class AbsenceNotesSection extends PureComponent{
  props: Props

  render(){
    const { userNote, adminNote, changeAdminNote, changeUserNote, adminMode } = this.props

    return(
      <Expander label='Notizen'>
        <fb className="absenceNotesSectionMain">
          <fb className='sectionWrapper adminSection'>
            <fb className='label'>Admin-Notiz</fb>
            { adminMode
              ? <textarea className='inp' type='text' onChange={(e)=>changeAdminNote(e.target.value)} />
              : adminNote && <fb className='noteDisplay'>{adminNote}</fb>
            }
          </fb>
          <fb className='sectionWrapper userSection'>
            <fb className='label'>Mitarbeiter-Notiz</fb>
            { !adminMode
              ? <textarea className='inp' type='text' onChange={(e)=>changeUserNote(e.target.value)} />
              : userNote && <fb className='noteDisplay'>{userNote}</fb>
            }
          </fb>
        </fb>
      </Expander>
    )
  }
}
