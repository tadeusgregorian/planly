//@flow
/* eslint radix: off */
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import ColorPicker from 'components/colorPicker'
import { generateGuid } from 'helpers/index'
import { saveDayNoteToDB } from 'actions/roster/dayNotes'

import SModal             from 'components/sModal'
import SButton            from 'components/sButton'

import type { Store, DayNote, Day } from 'types/index'

import './styles.css'

type OwnProps = {
  day: Day,
  closeModal: ()=>{},
}

type ConProps = {
  dayNote: ?DayNote,
  saveDayNoteToDB: (DayNote, ?boolean)=>any,
}

type State = {
  color: string,
  note: string,
}

class ExtraHoursModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    const dN = this.props.dayNote

    this.state = {
      color:    dN ? dN.color : '#e74c3c',
      note:     dN ? dN.note  : '',
    }
  }

  saveClicked = () => {
    const { color, note } = this.state
    const { day, dayNote } = this.props

    const id = dayNote ? dayNote.id : generateGuid()
    const newDayNote = { id, note, color, day }

    this.props.saveDayNoteToDB(newDayNote)
    this.props.closeModal()
  }

  removeClicked = () => {
    if(!this.props.dayNote) return // this should never happen.
    this.props.saveDayNoteToDB(this.props.dayNote, true)
    this.props.closeModal()
  }

  noteChanged = (e)     => this.setState({ note: e.target.value })
  colorPicked = (color) => this.setState({ color })

  render(){
    const { dayNote } = this.props
    const { note, color } = this.state

    return(
      <SModal.Main onClose={this.props.closeModal} title='Tagesnotiz eingeben'>
  			<SModal.Body>
  				<fb className="dayNoteModalMain">
            <fb className='content'>
              <fb className='colorBox icon icon-colorize' id='dn-color-box' style={{backgroundColor: color}} />
              <ColorPicker onPick={this.colorPicked} targetID='dn-color-box' />
              <input type='text' className='noteInput' value={note}  placeholder='Notiz' onChange={this.noteChanged}/>
            </fb>
  				</fb>
          <SModal.Footer>
            { dayNote && <SButton label='entfernen' onClick={this.removeClicked} grey left /> }
            <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  saveDayNoteToDB
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  dayNote: state.roster.dayNotes.find(dN => dN.day === ownProps.day ),
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(ExtraHoursModal)
