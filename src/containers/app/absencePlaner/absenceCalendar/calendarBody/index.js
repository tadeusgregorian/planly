// @flow
import React, { PureComponent } from 'react'

import AbsenceRow from './absenceRow'
import type { User, Absence } from 'types/index'

import './styles.css'

type Props = {
  branch: string,
  year: number,
  month: number,
  absences: Array<Absence>,
  users: Array<User>,
}

export default class CalendarBody extends PureComponent {
  props: Props

  render() {
    const { users, absences, year, month } = this.props

    return(
      <fb className="absenceCalendarBodyMain">
        { users.map(u => {
          const userAbsences = absences.filter(a => a.user === u.id)
          return <AbsenceRow key={u.id} user={u} year={year} month={month} absences={userAbsences} />
        })}
      </fb>
    )
  }
}
