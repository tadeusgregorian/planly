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
  onDecline?: ()=>any,
  noNegatives?: true,
}

export default class DurationInputModal extends PureComponent {
  constructor(props: Props){
    super(props)

    const { initialMins, noNegatives, note } = this.props

    this.state = {
      negative:   noNegatives ? false : initialMins < 0,
      hours:      initialMins ? minToTime(initialMins).hours.toString() : '',
      minutes:    initialMins ? minToTime(initialMins).minutes.toString() : '',
      note:       note && ''
    }
  }



  noteChanged = (e) => {
    this.setState({note: e.target.value})
  }

  confirmAndClose = () => {
    const { hours, minutes, negative, note } = this.state
    const mins = (parseInt((hours || 0), 10) * 60) + parseInt((minutes || 0), 10) * ( negative ? -1 : 1)

    this.props.onInputConfirmed({ mins, note })
    this.props.closeModal()
  }

  render = () => {
    const { closeModal, title, text, declineLabel, onDecline, withNote, note, noNegatives } = this.props
    const { hours, minutes, negative } = this.state

  	return(
  		<SModal.Main onClose={closeModal} title={title} >
  			<SModal.Body>
  				<fb className="durationInputModalContent">
  					<fb className="text">{text}</fb>
            <AbsoluteTimeInput
              negative={negative}
              hours={hours}
              minutes={minutes}
              negativeChanged={(negative)=>this.setState({negative})}
              hoursChanged={(hours)=>this.setState({hours})}
              minutesChanged={(minutes)=>this.setState({minutes})}
              noNegatives={noNegatives}
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
  				</fb>
  			</SModal.Body>
  			<SModal.Footer>
           { onDecline && <SButton label={declineLabel || 'Abbrechen'} onClick={onDecline} color='#ff3f3f' left /> }
  					<SButton label='fertig' onClick={this.confirmAndClose} color='#00a2ef' />
  			</SModal.Footer>
  		</SModal.Main>
  	)
  }
}
