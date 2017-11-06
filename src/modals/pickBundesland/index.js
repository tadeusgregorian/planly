//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { bundeslandOptions } from 'constants/general'
import { saveBundeslandToDB } from 'actions/accountDetails'
import SModal  from 'components/sModal'
import SButton from 'components/sButton'
import Dropdown from 'react-dropdown'
import type { BundeslandCode } from 'types/index'
import './styles.css'

type OwnProps = {
  closeModal: ()=>{},
}

type ConProps = {

}

type Props = OwnProps & ConProps

type State = {
  bundesland: ?BundeslandCode
}

class SaveTemplateModal extends PureComponent{
  state: State
  props: Props

  constructor(props: Props){
    super(props)

    this.state = {
      bundesland: null
    }
  }

  saveClicked = () => {
    const { bundesland } = this.state
    bundesland && saveBundeslandToDB(bundesland)
    this.props.closeModal()
  }

  render(){
    const { bundesland } = this.state
    const curBundesland = bundesland && bundeslandOptions.find(b => b.code === bundesland)
    const name = curBundesland && curBundesland.name

    return(
      <SModal.Main unclosable title='Bundesland'>
  			<SModal.Body>
  				<fb className="pickBundeslandMain">
            <fb className='label'>In welchem Bundesland Befindet sich Ihr Betrieb.</fb>
            <fb className='dropdownWrapper'>
              <Dropdown
                value={{value: bundesland, label: name}}
                options={bundeslandOptions.map(b => ({value: b.code , label: b.name }))}
                onChange={(opt) => this.setState({bundesland: opt.value })}
              />
            </fb>
  				</fb>
  			</SModal.Body>
        <SModal.Footer>
          <SButton label='speichern' disabled={!bundesland} onClick={this.saveClicked} color='#00a2ef' right />
        </SModal.Footer>
  		</SModal.Main>
    )
  }
}

const actionCreators = {
  saveBundeslandToDB
}

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(null, actionCreators)
export default connector(SaveTemplateModal)
