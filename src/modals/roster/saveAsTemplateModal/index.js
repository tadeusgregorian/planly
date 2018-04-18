//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import SModal  from 'components/sModal'
import SButton from 'components/sButton'
import { saveWeekAsTemplate } from 'actions/roster/template'
import { Toast } from 'helpers/iziToast'
import './styles.css'

type OwnProps = {
  closeModal: ()=>{},
}

type ConProps = {
  saveWeekAsTemplate: (string)=>any
}

type Props = OwnProps & ConProps

type State = {
  name: string
}

class SaveTemplateModal extends PureComponent{
  state: State
  props: Props

  state = {
    name: '',
    loading: false
  }


  saveClicked = () => {
    const { name } = this.state
    this.setState({ loading: true })
    this.props.saveWeekAsTemplate(name).then(() => {
      this.setState({ loading: false })
      Toast.success('Wochenplan als vorlage gespeichert: ' + name )
      this.props.closeModal()
    })
  }

  textChanged = (e: SyntheticInputEvent) =>  this.setState({name: e.target.value})

  render(){
    const { name, loading } = this.state

    return(
      <SModal.Main onClose={this.props.closeModal} title='Vorlage Speichern' >
  			<SModal.Body>
  				<fb className="saveTempPopupMain">
            <fb className='label'>Unter welchem Namen soll die Vorlage gespeichert werden?</fb>
            <fb className='inputWrapper'>
              <input className='nameInput' value={name} onChange={this.textChanged} placeholder='Vorlagenname' autoFocus />
            </fb>
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
          <SButton label='abbrechen' disabled={loading} onClick={this.props.closeModal} grey left />
          <SButton label={ loading ? '...' : 'speichern' } disabled={loading} onClick={this.saveClicked} color='#00a2ef' right />
        </SModal.Footer>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  saveWeekAsTemplate
}

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(null, actionCreators)
export default connector(SaveTemplateModal)
