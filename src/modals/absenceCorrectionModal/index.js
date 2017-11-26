//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { isIntStr, generateGuid, inp } from 'helpers/index'
import { saveAbsenceCorrectionToDB } from 'actions/absence'
import getAbsenceSums from 'selectors/absenceSums'

import Row          from './rowDisplay'
import SModal       from 'components/sModal'
import SButton      from 'components/sButton'

import type { Store, AbsenceCorrection } from 'types/index'

import './styles.css'

type OwnProps = {
  closeModal: Function,
  user: string,
}

type ConProps = {
  year: number,
  absentDays: number,
  absenceCorrection?: AbsenceCorrection,
  //saveAbsenceCorrectionToDB: (AbsenceCorrection) => void
}

type State = {
  extraDays: string,
  transferedDays: string,
  vacDaysCorrected: string,
}

class AbsenceCorrectionModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    this.state = {
      extraDays:      this.getDefault('extraDays'),
      transferedDays: this.getDefault('transferedDays'),
      vacDaysCorrected:        this.getDefault('vacDaysCorrected'),
    }
  }

  getDefault = (prop): string => {
    const { absenceCorrection } = this.props
    const val = absenceCorrection && absenceCorrection[prop]
    return val ? val.toString() : ''
  }

  toNullOrInt = (val) => val ? parseInt(val, 10) : null

  saveClicked = () => {
    const { absenceCorrection, user, year } = this.props

    const id              = absenceCorrection ? absenceCorrection.id : generateGuid()
    const extraDays       = this.toNullOrInt(this.state.extraDays)
    const transferedDays  = this.toNullOrInt(this.state.transferedDays)
    const vacDaysCorrected         = this.toNullOrInt(this.state.vacDaysCorrected)

    const correction = { id, user, year, extraDays, vacDaysCorrected, transferedDays }
    saveAbsenceCorrectionToDB(correction)
    this.props.closeModal()
  }

  onExtraDaysChanged = (e)      => isIntStr(inp(e)) && this.setState({ extraDays: inp(e) })
  onVacDaysChanged = (e)        => isIntStr(inp(e)) && this.setState({ vacDaysCorrected: inp(e) })
  onTransferedDaysChanged = (e) => isIntStr(inp(e)) && this.setState({ transferedDays: inp(e) })

  render(){
    const { extraDays, vacDaysCorrected, transferedDays } = this.state
    const { absentDays } = this.props

    return(
      <SModal.Main onClose={this.props.closeModal} title='Urlabsberechnung'>
  			<SModal.Body>
  				<fb className="absenceCorrectionModalMain">
            <Row label='eingetragener Urlaub 2017'>
              <fb className='daysDisplay'>{absentDays}</fb>
            </Row>
            <Row label='nicht eingetragener Urlaub 2017'>
              <fb className='inpWrapper'><input value={extraDays} onChange={this.onExtraDaysChanged} placeholder='0' /></fb>
            </Row>
            <fb style={{height: 30}} />
            <Row label='Resturlaub aus Vorjahr'>
              <fb className='inpWrapper'><input value={transferedDays} onChange={this.onTransferedDaysChanged} placeholder='0' /></fb>
            </Row>
            <Row label='korrigierter Urlaubsanspurch 2017'>
              <fb className='inpWrapper'><input value={vacDaysCorrected} onChange={this.onVacDaysChanged} placeholder='' /></fb>
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
  //saveAbsenceCorrectionToDB
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  year: state.ui.absence.currentYear,
  //$FlowFixMe -> we are sure that this returns a number
  absentDays: getAbsenceSums(state).find(s => s.user === ownProps.user).days,
  absenceCorrection: state.absencePlaner.absenceCorrections.find(ac => ac.user === ownProps.user) // dont need to filter for year -> cause we have always only
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(AbsenceCorrectionModal)
