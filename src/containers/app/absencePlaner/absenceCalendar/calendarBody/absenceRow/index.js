// @flow
import React, { PureComponent } from 'react'

import MonthCell from './monthCell'
import UserCell from './userCell'
import type { User, Absence, AbsenceType } from 'types/index'

import './styles.css'

type Props = {
  user: User,
  month: number,
  year: number,
  type: AbsenceType | 'all',
  absences: Array<Absence>,
  absentDays: number,
  adminMode: boolean,
}

export default class AbsenceRow extends PureComponent {
  props: Props

  render() {
    const { user, year, month, absences, adminMode, absentDays, type } = this.props

    return(
      <fb className="absenceRowMain">
        <UserCell user={user} adminMode={adminMode} daysSum={absentDays} type={type} year={year}/>
        <MonthCell month={month} year={year} absences={absences} />
      </fb>
    )
  }
}
