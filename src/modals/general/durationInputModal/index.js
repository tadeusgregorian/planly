import React, {PureComponent} from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import { minToTime } from 'helpers/roster'
import AbsoluteTimeInput from 'components/absoluteTimeInput'
import './styles.css'

type Props = {
  closeModal: Function ,
  onInputConfirmed: (miutes: number)=>any,
  title: string,
  text?: string,
  initialMins?: number,
  withNote?: string,
  note?: string,
  declineLabel?: string,
  onDecline?: ()=>any
}

export default class DurationInputModal extends PureComponent {
  constructor(props: Props){
    super(props)

    const io = this.props.initialMins

    this.state = {
      negative:   io ? io.mins < 0                           : false,
      hours:      io ? minToTime(io.mins).hours.toString()   : '',
      minutes:    io ? minToTime(io.mins).minutes.toString() : '',
      note:       io ? (io.note || '')                       : '' ,
    }
  }

  saveClicked = () => {
    const { hours, minutes, negative, note } = this.state
    const mins = (parseInt((hours || 0), 10) * 60) + parseInt((minutes || 0), 10) * ( negative ? -1 : 1)
    this.props.onInputConfirmed({ mins, note })
  }

  noteChanged = (e) => {
    this.setState({note: e.target.value})
  }

  closeAndAccpet = () => {
    this.props.onInputConfirmed()
    this.props.closeModal()
  }

  render = () => {
    const { closeModal, title, text, declineLabel, onDecline, withNote, note } = this.props
    const { hours, minutes, negative } = this.state

  	return(
  		<SModal.Main onClose={closeModal} title={title} >
  			<SModal.Body>
  				<fb className="confirmPopupBodyContent">
  					{text}
  				</fb>
          <AbsoluteTimeInput
            negative={negative}
            hours={hours}
            minutes={minutes}
            negativeChanged={(negative)=>this.setState({negative})}
            hoursChanged={(hours)=>this.setState({hours})}
            minutesChanged={(minutes)=>this.setState({minutes})}
          />
          { withNote &&
            <fb className='noteSection'>
              <textarea
                type='text'
                value={note || ''}
                onChange={this.noteChanged}
                className='extraHoursInput'
                placeholder='Notiz'
              />
            </fb>
          }
  			</SModal.Body>
  			<SModal.Footer>
           { onDecline && <SButton label={declineLabel} onClick={onDecline} grey left /> }
  					<SButton label='fertig' onClick={this.closeAndAccpet} mini />
  			</SModal.Footer>
  		</SModal.Main>
  	)
  }
}
