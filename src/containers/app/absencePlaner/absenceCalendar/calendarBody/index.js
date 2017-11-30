// @flow
import React, { PureComponent } from 'react'
import sortBy from 'lodash/sortBy'
import AbsenceRow from './absenceRow'
import type { User, Absence, AbsenceType, Position, AbsenceCorrection } from 'types/index'

import './styles.css'

type Props = {
  branch: string,
  year: number,
  month: number,
  absences: Array<Absence>,
  absenceSums: Array<{user: string, days: number}>,
  users: Array<User>,
  adminMode: boolean,
  type: AbsenceType | 'all',
  positions: Array<Position>,
  currentVacDays: {[user: string]: number },
  absenceCorrections: Array<AbsenceCorrection>
}

export default class CalendarBody extends PureComponent {
  props: Props

  getPosNrOfUser = (user: User) =>
    this.props.positions.find(p => p.id === user.position)

  render() {
    const {
      users,
      absences,
      year,
      month,
      adminMode,
      absenceSums,
      type,
      absenceCorrections,
      currentVacDays } = this.props

    return(
      <fb className="absenceCalendarBodyMain">
        { sortBy(users, [this.getPosNrOfUser]).map(u => {
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
            currentVacDays={currentVacDays[u.id]}
            absenceCorrection={absenceCorrections.find(a => a.user === u.id)}
            adminMode={adminMode} />
          )}
        )}
      </fb>
    )
  }
}
