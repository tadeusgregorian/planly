//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { User, Note } from 'types/index'
import SModal from 'components/sModal'
import { writeNoteToDB } from 'actions/roster'
import './styles.css'

type Props = {
  smartWeek: string,
  branch: string,
  users: Array<User>,
  notes: Array<Note>,
  currentUserID: string,
  user?: string, // The user that the shiftCell belongs to ( if its a shiftNote )
  day: string,
  type: 'shiftNote' | 'dayNote',
  closeModal: ()=>{}
}

type State = { text: string, editMode: boolean }

class NotesPopup extends PureComponent{
  state: State
  props: Props

  constructor(props: Props){
    super(props)

    const currentUsersNote = props.notes.find(n => n.user === props.currentUserID )
    const currentUsersNoteText = currentUsersNote ?  currentUsersNote.text : ''

    this.state = { text: currentUsersNoteText, editMode: !currentUsersNote }
  }

  saveClicked = () => {
    const { smartWeek, branch, user, day, type } = this.props
    const { text }  = this.state
    const author    = this.props.currentUserID

    writeNoteToDB({ smartWeek, branch, author, text, type, user, day })
    this.setState({editMode: false})
  }

  editClicked = () =>   this.setState({editMode: true})
  textChanged = (e) =>  this.setState({text: e.target.value})

  render(){
    const { text, editMode }        = this.state
    const { users, currentUserID }  = this.props
    const user = users.find(user => user.id === currentUserID)
    const currentUserName = user && user.name

    return(
      <SModal.Main onClose={this.props.closeModal} title='Notizen' >
  			<SModal.Body>
  				<fb className="notesPopupMain">
            <fb className='commentBox'>
              <fb className='author'>{currentUserName}</fb>
              <fb className='textWrapper'>
                { editMode ?
                  <textarea className='textArea' value={this.state.text} onChange={this.textChanged} autoFocus /> :
                  <fb className='textDisplay'>{text}</fb>
                }
              </fb>
              <fb className='actionsBar'>
                <fb className='right'>
                  { editMode ?
                    <fb className='saveButton btn' onClick={this.saveClicked}>speichern</fb> :
                    <fb className='editButton btn' onClick={this.editClicked}>bearbeiten</fb>
                  }
                </fb>
              </fb>
            </fb>
  				</fb>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}



const mapStateToProps = (state, ownProps) => {
  const { day, user, type } = ownProps
  const smartWeek           = state.ui.roster.currentSmartWeek
  const branch              = state.ui.roster.currentBranch
  const users               = state.core.users
  const currentUserID       = state.auth.currentUserID
  const dayNoteFilter       = (note) => note.day === day
  const shiftNoteFilter     = (note) => note.day === day && note.user === user
  const notes               = state.roster.notes.filter(n => type === 'shiftNote' ? shiftNoteFilter(n) : dayNoteFilter(n))
  const currentUsersNote    = notes.find(n => n.user === currentUserID )

  return { smartWeek, branch, users, currentUserID, notes, currentUsersNote }
}

export default connect(mapStateToProps)(NotesPopup)
