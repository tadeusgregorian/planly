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
  adminMode: boolean,
}

export default class CalendarBody extends PureComponent {
  props: Props

  render() {
    const { users, absences, year, month, adminMode } = this.props

    return(
      <fb className="absenceCalendarBodyMain">
        { users.map(u => (
           <AbsenceRow
              key={u.id}
              user={u}
              year={year}
              month={month}
              absences={absences.filter(a => a.user === u.id)}
              adminMode={adminMode}
            />
          )
        )}
      </fb>
    )
  }
}
