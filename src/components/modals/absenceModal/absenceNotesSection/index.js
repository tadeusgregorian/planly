//@flow
import React, { PureComponent } from 'react'
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
  state: { expanded: boolean }

  constructor(props: Props){
    super(props)

    this.state = {
      expanded: props.expanded
    }
  }

  render(){
    const { userNote, adminNote, changeAdminNote, changeUserNote, adminMode } = this.props
    const { expanded } = this.state

    return(
      <fb className="absenceNotesSectionMain">
        <fb className='head' onClick={()=>this.setState({expanded: !expanded})}>
          <fb className={'expandIcon icon ' + (expanded ? 'icon-arrow_drop_up' : 'icon-arrow_drop_down')} />
          <fb className='text'>Notizen</fb>
        </fb>
        <fb className='content' style={{display: expanded ? 'flex' : 'none'}}>
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
      </fb>
    )
  }
}
