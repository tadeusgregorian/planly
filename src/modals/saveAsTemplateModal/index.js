//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import SModal  from 'components/sModal'
import SButton from 'components/sButton'
import { savelWeekAsTemplate } from 'actions/roster/template'
import './styles.css'

type OwnProps = {
  closeModal: ()=>{},
}

type ConProps = {
  savelWeekAsTemplate: (string)=>any
}

type Props = OwnProps & ConProps

type State = {
  name: string
}

class SaveTemplateModal extends PureComponent{
  state: State
  props: Props

  state = {
    name: ''
  }


  saveClicked = () => {
    const { name } = this.state
    this.props.savelWeekAsTemplate(name)
    this.props.closeModal()
  }

  textChanged = (e: SyntheticInputEvent) =>  this.setState({name: e.target.value})

  render(){
    return(
      <SModal.Main onClose={this.props.closeModal} title='Vorlage Speichern' >
  			<SModal.Body>
  				<fb className="saveTempPopupMain">
            <fb className='label'>Unter welchem Namen soll die Vorlage gespeichert werden?</fb>
            <fb className='inputWrapper'>
              <input className='nameInput' value={this.state.name} onChange={this.textChanged} placeholder='Vorlagenname' autoFocus />
            </fb>
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
          <SButton label='abbrechen'   onClick={this.props.closeModal} grey left />
          <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
        </SModal.Footer>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  savelWeekAsTemplate
}

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(null, actionCreators)
export default connector(SaveTemplateModal)
