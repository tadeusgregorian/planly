//@flow
import React from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { openModal } from 'actions/ui/modals'
import type { User, AbsenceType } from 'types/index'
import './styles.css'

type OwnProps = {
  user: User,
  adminMode: boolean,
  daysSum?: number,
  type: AbsenceType | 'all',
}

type ConProps = {
  openModal: Function
}

type Props = OwnProps & ConProps

const UserCell =  ({user, adminMode, daysSum, type, openModal}: Props) => {
  const vacMode = type === 'vac'
  const { vacDays } = user

  const typeDaysGerman = {
    all: 'Abwesenheitstage',
    vac: 'Urlaubstage',
    ill: 'Krankheitstage',
    extra: 'Abwesenheitstage/Sonstiges'
  }

  const daysSumClicked = () => {
    adminMode && vacMode && openModal('ABSENCE_CORRECTION')
  }

  return(
    <fb className='absenceUserCellMain'>
      { adminMode && <fb className='addAbsenceBtn' data-type='absence-user' data-user={user.id}>+</fb> }
      <fb className='userName'>{user.name}</fb>
        <fb className='daysSum' data-balloon={'Summe der ' + typeDaysGerman[type] + ' in 2017'} onClick={daysSumClicked}>
          <fb className='count'>{daysSum}</fb>
          { vacMode && vacDays && <fb className='vacDays'>{'/ ' + vacDays}</fb>}
        </fb>
    </fb>
  )
}

const actionCreators = {
  openModal
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(UserCell)
