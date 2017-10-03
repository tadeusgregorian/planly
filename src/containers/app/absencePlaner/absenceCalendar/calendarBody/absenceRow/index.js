// @flow
import React, { PureComponent } from 'react'

import MonthCell from './monthCell'
import type { User, Absence } from 'types/index'

import './styles.css'

type Props = {
  user: User,
  month: number,
  year: number,
  absences: Array<Absence>,
}

export default class AbsenceRow extends PureComponent {
  props: Props

  render() {
    const { user, year, month, absences } = this.props

    return(
      <fb className="absenceRowMain">
        <fb className='userCell' data-type='absence-user' data-user={user.id} >{user.name}</fb>
        <MonthCell month={month} year={year} absences={absences} />
      </fb>
    )
  }
}
