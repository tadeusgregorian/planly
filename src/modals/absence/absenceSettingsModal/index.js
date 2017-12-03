//@flow
/* eslint radix: off */
import React, { PureComponent } from 'react'
import SModal             from 'components/sModal'
import SButton            from 'components/sButton'

import './styles.css'

type Props = {
  closeModal: Function,
}

type State = {
  excludingSaturdays: ?boolean,
}

export default class EditAbsenceDaysModal extends PureComponent{
  state: State
  props: Props

  constructor(props: Props){
    super(props)

    this.state = {
      excludingSaturdays: undefined
    }
  }

  render(){
    const { excludingSaturdays } = this.state

    return(
      <SModal.Main onClose={this.props.closeModal} title='Urlaubsplaner Einstellung'>
  			<SModal.Body>
  				<fb className="absenceSettingsModalMain">
            <fb>Wird in Ihrem Betrieb nach einer 5- oder 6-Tage-Woche gearbeitet.</fb>
            <fb>
              <fb>BTN</fb>
              <fb>Bei einer 5-Tage-Woche werden Samstage Nicht</fb>
            </fb>
            <fb>
              <fb>BTN</fb>
              <fb>Bei einer 5-Tage-Woche werden Samstage Nicht</fb>
            </fb>
  				</fb>
          <SModal.Footer>
            <SButton
              label='übernehmen'
              disabled={excludingSaturdays }
              onClick={()=>console.log('was')}
              color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}
