//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import Row   from './rowDisplay'
import SModal       from 'components/sModal'
import SButton      from 'components/sButton'

import type { Store } from 'types/index'

import './styles.css'

type OwnProps = {
  closeModal: Function
}

type ConProps = {

}

type State = {
  extraDays: string,
  vacDays: string,
}

class AbsenceCorrectionModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    this.state = {
      extraDays: '',
      vacDays: ''
    }
  }

  saveClicked = () => {
    this.props.closeModal()
  }

  onExtraDaysChanged = (e) => {
    console.log(e.target.value);
  }
  
  onVacDaysChanged = (e) => {
    console.log(e.target.value);
  }


  render(){
    const { extraDays, vacDays } = this.state

    return(
      <SModal.Main onClose={this.props.closeModal} title='Urlabsberechnung'>
  			<SModal.Body>
  				<fb className="absenceCorrectionModalMain">
            <Row label='eingetragener Urlaub 2017'>
              <fb className='daysDisplay'>19</fb>
            </Row>
            <Row label='extra Urlaub 2017'>
              <fb className='inpWrapper'><input value={vacDays} onChange={this.onVacDaysChanged} placeholder='0' /></fb>
            </Row>
            <Row label='Urlaubsanspurch im Jahr'>
              <fb className='daysDisplay'>35</fb>
            </Row>
            <Row label='korrektur - Urlaubsanspurch 2017'>
              <fb className='inpWrapper'><input value={vacDays} onChange={this.onVacDaysChanged} placeholder='0' /></fb>
            </Row>
  				</fb>
          <SModal.Footer>
            <SButton label='speichern'   onClick={this.saveClicked} color='#00a2ef' right />
          </SModal.Footer>
  			</SModal.Body>
  		</SModal.Main>
    )
  }
}

const actionCreators = {

}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({

})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(AbsenceCorrectionModal)
