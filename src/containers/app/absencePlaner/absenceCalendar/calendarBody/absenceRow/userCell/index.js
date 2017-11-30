//@flow
import React, { PureComponent } from 'react'
import type { User, AbsenceType, AbsenceCorrection } from 'types/index'
import SumsDisplay from './sumsDisplay'
import './styles.css'

type Props = {
  user: User,
  adminMode: boolean,
  daysSum: number,
  year: number,
  type: AbsenceType | 'all',
  currentVacDays: ?number,
  absenceCorrection: ?AbsenceCorrection,
}

export default class UserCell extends PureComponent {
  props: Props

  render(){
    const { user, adminMode } = this.props

    return(
      <fb className='absenceUserCellMain'>
        { adminMode && <fb className='addAbsenceBtn' data-type='absence-user' data-user={user.id}>+</fb> }
        <fb className='userName'>{user.name}</fb>
        <SumsDisplay { ...this.props }/>
      </fb>
    )
  }
}
