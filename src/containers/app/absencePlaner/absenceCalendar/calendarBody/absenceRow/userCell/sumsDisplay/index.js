//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'

import { openModal } from 'actions/ui/modals'
import type { User, AbsenceType, AbsenceCorrection } from 'types/index'
import './styles.css'

type OwnProps = {
  user: User,
  adminMode: boolean,
  daysSum: number,
  year: number,
  type: AbsenceType | 'all',
  currentVacDays: ?number,
  absenceCorrection: ?AbsenceCorrection,
}

type ConProps = {
  openModal: Function,
}

type Props = OwnProps & ConProps

class SumsDisplay extends PureComponent{
  props: Props

  daysSumClicked = () => {
    const { adminMode, type, user, currentVacDays, daysSum, openModal } = this.props
    adminMode && type === 'vac' && openModal('ABSENCE_CORRECTION', {
      user: user.id,
      vacDays: currentVacDays,
      absentDays: daysSum,
    })
  }

  getTypeDaysGerman = (type) => {
    switch (type) {
      case 'vac':   return 'Urlaubstage'
      case 'ill':   return 'Krankheitstage'
      case 'extra': return 'Sonstigen Abwesenheitstage'
      default: return 'Abwesenheitstage'
    }
  }

  propToInt = (obj: ?{}, prop: string) => obj ? ( obj[prop] || 0 ) : 0

  render(){
    const { adminMode, type, daysSum, year, currentVacDays, absenceCorrection } = this.props

    const vacMode           = type === 'vac'
    const extraDays         = this.propToInt(absenceCorrection, 'extraDays')
    const vacDaysTransfered = this.propToInt(absenceCorrection, 'vacDaysTransfered')
    const vacDaysCorrected  = this.propToInt(absenceCorrection, 'vacDaysCorrected')

    const resultingVacDays  = vacDaysCorrected || currentVacDays + vacDaysTransfered

    return(
      <fb
        className={cn({ absenceSumsDisplayMain: 1, adminMode, vacMode })}
        data-balloon={'Summe der ' + this.getTypeDaysGerman(type) + ' in ' + year}
        data-balloon-pos='right'
        onClick={this.daysSumClicked}
      >
        <fb className='count'>{daysSum + extraDays}</fb>
        { vacMode && !!currentVacDays && <fb className='vacDays'>{'/ ' + resultingVacDays }</fb>}
        {/* { currentCorrection && adminMode && <fb className='editedIcon icon icon-mode_edit'></fb> } */}
      </fb>
    )
  }
}


const actionCreators = {
  openModal
}

const connector: Connector<OwnProps, Props> = connect(null, actionCreators)
export default connector(SumsDisplay)
