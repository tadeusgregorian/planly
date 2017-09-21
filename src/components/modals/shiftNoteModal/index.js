//@flow
import React, { PureComponent } from 'react'
import SModal from 'components/sModal'
import './styles.css'

type Props = {
  note: string,
  saveNote: (string)=>void,
  closeModal: ()=>{},
}

type State = { text: string }

export default class NotesPopup extends PureComponent{
  state: State
  props: Props

  constructor(props: Props){
    super(props)

    this.state = {
      text: this.props.note
    }
  }

  saveClicked = () => {
    this.props.saveNote(this.state.text)
    this.props.closeModal()
  }

  textChanged = (e: SyntheticInputEvent) =>  this.setState({text: e.target.value})

  render(){
    return(
      <SModal.Main onClose={this.props.closeModal} title='Notizen' >
  			<SModal.Body>
  				<fb className="notesPopupMain">
            <fb className='commentBox'>
              <fb className='textWrapper'>
                <textarea className='textArea' value={this.state.text} onChange={this.textChanged} autoFocus />
              </fb>
              <fb className='actionsBar'>
                <fb className='right'>
                  <fb className='cancelButton btn' onClick={this.props.closeModal}>abbrechen</fb>
                  <fb className='saveButton btn' onClick={this.saveClicked}>speichern</fb>
                </fb>
              </fb>
            </fb>
  				</fb>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}
