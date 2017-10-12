// @flow
import React, { PureComponent } from 'react'

import AbsenceRow from './absenceRow'
import type { User, Absence, AbsenceType } from 'types/index'

import './styles.css'

type Props = {
  branch: string,
  year: number,
  month: number,
  absences: Array<Absence>,
  absenceSums: Array<{user: string, days: number}>,
  users: Array<User>,
  adminMode: boolean,
  type: AbsenceType | 'all'
}

export default class CalendarBody extends PureComponent {
  props: Props

  render() {
    const { users, absences, year, month, adminMode, absenceSums, type } = this.props

    return(
      <fb className="absenceCalendarBodyMain">
        { users.map(u => {
          const userAbsences = absences.filter(a => a.user === u.id)
          const absentDays = absenceSums.find(s => s.user === u.id)
          return ( <AbsenceRow
            key={u.id}
            user={u}
            year={year}
            month={month}
            type={type}
            absentDays={absentDays && absentDays.days}
            absences={userAbsences}
            adminMode={adminMode} />
          )}
        )}
      </fb>
    )
  }
}
