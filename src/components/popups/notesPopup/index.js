//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { userType, Note, ThunkAction } from 'types/index'
import SModal from 'components/sModal'
import { writeShiftNoteToDB } from 'actions/roster'
import './styles.css'

type Props = {
  users: Array<userType>,
  notes: Array<Note>,
  currentUsersNote: Note,
  currentUserID: string,
  closeModal: ()=>{},
  writeShiftNoteToDB: (string)=>ThunkAction
}

class NotesPopup extends PureComponent{
  state: { text: string, editMode: boolean }
  props: Props

  constructor(props: Props){
    super(props)

    this.state = {
      text: this.props.currentUsersNote ?  this.props.currentUsersNote.text : '',
      editMode: !this.props.currentUsersNote
    }
  }

  saveClicked = () => {
    this.props.writeShiftNoteToDB(this.state.text)
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



const mapStateToProps = (state) => {
  const fCell            = state.ui.roster.weekPlan.focusedCell
  const currentUserID    = state.auth.currentUserID
  const notes            = state.roster.notes.filter(n => n.day === fCell.day && n.user === fCell.user)
  const currentUsersNote = notes.find(n => n.user === currentUserID )

  return { users: state.core.users, currentUserID, notes, currentUsersNote }
}

const actionsToProps = {
  writeShiftNoteToDB
}

export default connect(mapStateToProps, actionsToProps)(NotesPopup)
