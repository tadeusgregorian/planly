//@flow
/* eslint radix: off */
import React, { PureComponent } from 'react'
import { isIntStr, inpToInt } from 'helpers/index'
import SModal             from 'components/sModal'
import SButton            from 'components/sButton'

import './styles.css'

type Props = {
  effectiveDays: number,
  changeEffectiveDays: (number)=>any,
  closeModal: Function,
}

type State = {
  effectiveDays: string,
}

export default class ExtraHoursModal extends PureComponent{
  state: State
  props: Props

  constructor(props: Props){
    super(props)

    this.state = {
      effectiveDays: this.props.effectiveDays.toString()
    }
  }

  saveClicked = () => {
    const days = inpToInt(this.state.effectiveDays)
    this.props.changeEffectiveDays(days)
    this.props.closeModal()
  }

  onChange = (e: any) => {
    const inp = e.target.value
    isIntStr(inp) && this.setState({ effectiveDays: inp })
  }

  render(){
    const { effectiveDays } = this.state

    return(
      <SModal.Main onClose={this.props.closeModal} title='Effektive Abwesenheitstage'>
  			<SModal.Body>
  				<fb className="editAbsenceDaysModalMain">
            <fb className='explenationText'>
              Trage die effektiven Abwesenheitstage ein
            </fb>
              <input
                type='text'
                value={effectiveDays}
                onChange={this.onChange}
                className='daysInput'
              />
  				</fb>
          <SModal.Footer>
            <SButton label='übernehmen'   onClick={this.saveClicked} color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}
