//@flow
import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'

import { openModal } from 'actions/ui/modals'
import type { Store, User, AbsenceType, AbsenceCorrection } from 'types/index'
import './styles.css'

type OwnProps = {
  user: User,
  adminMode: boolean,
  daysSum: number,
  year: number,
  type: AbsenceType | 'all',
}

type ConProps = {
  absenceCorrection: ?AbsenceCorrection ,
  openModal: Function
}

type Props = OwnProps & ConProps

const SumsDisplay = ({ adminMode, type, user, year, daysSum, openModal, absenceCorrection }: Props) => {

  const daysSumClicked = () => {
    adminMode && type === 'vac' && openModal('ABSENCE_CORRECTION', { user: user.id, absentDays: daysSum })
  }

  const getTypeDaysGerman = (type) => {
    switch (type) {
      case 'vac':   return 'Urlaubstage'
      case 'ill':   return 'Krankheitstage'
      case 'extra': return 'Sonstigen Abwesenheitstage'
      default: return 'Abwesenheitstage'
    }
  }

  const propToInt = (obj: ?{}, prop: string) => obj ? ( obj[prop] || 0 ) : 0

  const vacMode           = type === 'vac'
  const vacDays           = user.vacDays
  const extraDays         = propToInt(absenceCorrection, 'extraDays')
  const transferedDays    = propToInt(absenceCorrection, 'transferedDays')
  const vacDaysCorrected  = propToInt(absenceCorrection, 'vacDaysCorrected')
  const resultingVacDays  = vacDaysCorrected || vacDays + transferedDays

  return(
    <fb
      className={cn({ absenceSumsDisplayMain: 1, adminMode, vacMode })}
      data-balloon={'Summe der ' + getTypeDaysGerman(type) + ' in ' + year}
      data-balloon-pos='right'
      onClick={daysSumClicked}
    >
      <fb className='count'>{daysSum + extraDays}</fb>
      { vacMode && vacDays && <fb className='vacDays'>{'/ ' + resultingVacDays }</fb>}
      { absenceCorrection && adminMode && <fb className='editedIcon icon icon-mode_edit'></fb> }
    </fb>
  )
}

const actionCreators = {
  openModal
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  absenceCorrection: ownProps.type === 'vac'
    ? state.absencePlaner.absenceCorrections.find(ac => ac.user === ownProps.user.id)
    : null
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(SumsDisplay)
