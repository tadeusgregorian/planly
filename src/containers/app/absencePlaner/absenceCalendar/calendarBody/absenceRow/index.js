// @flow
import React, { PureComponent } from 'react'

import MonthCell from './monthCell'
import UserCell from './userCell'
import type { User, Absence } from 'types/index'

import './styles.css'

type Props = {
  user: User,
  month: number,
  year: number,
  absences: Array<Absence>,
  adminMode: boolean,
}

export default class AbsenceRow extends PureComponent {
  props: Props

  render() {
    const { user, year, month, absences, adminMode } = this.props

    return(
      <fb className="absenceRowMain">
        <UserCell user={user} adminMode={adminMode}/>
        <MonthCell month={month} year={year} absences={absences} />
      </fb>
    )
  }
}
