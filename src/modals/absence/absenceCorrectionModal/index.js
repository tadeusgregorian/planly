//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'
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
  vacDays: ?number, // this is passed seperatly -> it may come from AbsenceCorretion from a past year -> we preserve this data.
}

type ConProps = {
  year: number,
  absentDays: number,
  absenceCorrection?: AbsenceCorrection,
}

type State = {
  vacDays: string,
  vacDaysCorrection: string,
  vacDaysCorNegative: boolean,
  extraDays: string,
  extraDaysNegative: boolean,
}

class AbsenceCorrectionModal extends PureComponent{
  state: State
  props: OwnProps & ConProps

  constructor(props: OwnProps & ConProps){
    super(props)

    const { vacDays, absenceCorrection } = this.props
    const absCor = absenceCorrection

    this.state = {
      vacDays:            (vacDays && vacDays.toString()) || '', // we access the vacDays passed through the own props ( it might me vacDays of past Years correction )
      vacDaysCorrection:  this.getDefaultToString('vacDaysCorrection'),
      extraDays:          this.getDefaultToString('extraDays'),
      vacDaysCorNegative: !!absCor && !!absCor.vacDaysCorrection && absCor.vacDaysCorrection < 0,
      extraDaysNegative:  !!absCor && !!absCor.extraDays         && absCor.extraDays < 0,
    }
  }

  getDefaultToString = (prop): string => {
    const correction = this.props.absenceCorrection
    return correction && correction[prop] ? (Math.abs(correction[prop])).toString() : ''
  }


  toNullOrInt = (val, negativ) => val ? +val * (negativ ? -1 : 1 ) : null

  saveClicked = () => {
    const { absenceCorrection, user, year } = this.props
    const { vacDays, extraDays, vacDaysCorrection, extraDaysNegative, vacDaysCorNegative } = this.state

    const id                = absenceCorrection ? absenceCorrection.id : generateGuid()
    const _vacDays           = this.toNullOrInt(vacDays)
    const _extraDays         = this.toNullOrInt(extraDays, extraDaysNegative)
    const _vacDaysCorrection = this.toNullOrInt(vacDaysCorrection, vacDaysCorNegative)

    const correction = {
      id,
      user,
      year,
      vacDays: _vacDays,
      extraDays: _extraDays,
      vacDaysCorrection: _vacDaysCorrection,
    }
    saveAbsenceCorrectionToDB(correction)
    this.props.closeModal()
  }


  onVacDaysChanged = (e)          => isIntStr(inp(e)) && this.setState({ vacDays: inp(e) })
  onTransferedDaysChanged = (e)   => isIntStr(inp(e)) && this.setState({ vacDaysCorrection: inp(e) })
  onExtraDaysChanged = (e)        => isIntStr(inp(e)) && this.setState({ extraDays: inp(e) })

  render(){
    const { extraDays, vacDaysCorrection, vacDays, vacDaysCorNegative, extraDaysNegative } = this.state
    const { absentDays, year } = this.props

    return(
      <SModal.Main onClose={this.props.closeModal} title='Urlaubsberechnung'>
  			<SModal.Body>
  				<fb className="absenceCorrectionModalMain">
            <Row label='Jähricher Urlaubsanspruch'>
              <fb className='inpWrapper'><input value={vacDays} onChange={this.onVacDaysChanged} placeholder='0' /></fb>
            </Row>
            <Row label={'Korrektur für ' + year} grey>
              <fb className={cn({signButton: 1, red:   1, active:  vacDaysCorNegative })} onClick={()=>this.setState({ vacDaysCorNegative: true  })}>-</fb>
              <fb className={cn({signButton: 1, green: 1, active: !vacDaysCorNegative })} onClick={()=>this.setState({ vacDaysCorNegative: false })}>+</fb>
              <fb className='inpWrapper'><input value={vacDaysCorrection} onChange={this.onTransferedDaysChanged} placeholder='0' /></fb>
            </Row>
            <fb style={{height: 30}} />
            <Row label={'Genommener Urlaub ' + year}>
              <fb className='daysDisplay'>{absentDays}</fb>
            </Row>
            <Row label={'Korrektur für ' + year} grey>
              <fb className={cn({signButton: 1, red:   1, active:  extraDaysNegative })} onClick={()=>this.setState({ extraDaysNegative: true })}>-</fb>
              <fb className={cn({signButton: 1, green: 1, active: !extraDaysNegative })} onClick={()=>this.setState({ extraDaysNegative: false  })}>+</fb>
              <fb className='inpWrapper'><input value={extraDays} onChange={this.onExtraDaysChanged} placeholder='0' /></fb>
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
  year: state.ui.absence.currentYear,
  //$FlowFixMe -> we are sure that this returns a number
  absentDays: getAbsenceSums(state).find(s => s.user === ownProps.user).days,
  absenceCorrection: state.absencePlaner.absenceCorrections.find(ac => {
    return ac.user === ownProps.user && ac.year === state.ui.absence.currentYear
  })
})

const connector: Connector<OwnProps, OwnProps & ConProps> = connect(mapStateToProps, actionCreators)
export default connector(AbsenceCorrectionModal)
