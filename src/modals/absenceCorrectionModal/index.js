//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { isIntStr, generateGuid } from 'helpers/index'
import { saveAbsenceCorrectionToDB } from 'actions/absence'

import Row          from './rowDisplay'
import SModal       from 'components/sModal'
import SButton      from 'components/sButton'

import type { Store, AbsenceCorrection } from 'types/index'

import './styles.css'

type OwnProps = {
  closeModal: Function,
  user: string,
  year: number
}

type ConProps = {
  absenceCorrection?: AbsenceCorrection,
  saveAbsenceCorrectionToDB: (AbsenceCorrection) => void
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
      extraDays: this.getDefault('extraDays'),
      vacDays:   this.getDefault('vacDays')
    }
  }

  getDefault = (prop) => {
    const { absenceCorrection } = this.props
    const val = absenceCorrection && absenceCorrection[prop]
    return val ? val.toString() : ''
  }

  toNullOrInt = (val) => val ? parseInt(val, 10) : null

  saveClicked = () => {
    const { absenceCorrection } = this.props

    const id        = absenceCorrection ? absenceCorrection.id : generateGuid()
    const extraDays = this.toNullOrInt(this.state.extraDays)
    const vacDays   = this.toNullOrInt(this.state.vacDays)

    this.props.closeModal()
  }

  onExtraDaysChanged = (e) => {
    const inp = e.target.value
    isIntStr(inp) && this.setState({ extraDays: inp })
  }

  onVacDaysChanged = (e) => {
    const inp = e.target.value
    isIntStr(inp) && this.setState({ vacDays: inp })
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
            <Row label='nicht eingetragener Urlaub 2017'>
              <fb className='inpWrapper'><input value={extraDays} onChange={this.onExtraDaysChanged} placeholder='0' /></fb>
            </Row>
            <Row label='Urlaubsanspurch 2017'>
              <fb className='inpWrapper'><input value={vacDays} onChange={this.onVacDaysChanged} placeholder='35' /></fb>
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
  saveAbsenceCorrectionToDB
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  absenceCorrection: {}
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(AbsenceCorrectionModal)
