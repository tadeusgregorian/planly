// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import CalendarHead from './calendarHead'
import CalendarBody from './calendarBody'
import getCurrentVacDays from 'selectors/currentVacDays'
import type { User, Store, Absence, AbsenceType, Position, BundeslandCode, AbsenceCorrection } from 'types/index'
import './styles.css'

type OwnProps = {
  absences: Array<Absence>,
  absenceSums: Array<{user: string, days: number}>,
  loading: boolean,
  adminMode: boolean,
}

type ConProps = {
  users: Array<User>,
  branch: string,
  year: number,
  month: number,
  type: AbsenceType | 'all',
  positions: Array<Position>,
  currentVacDays: { [userID: string]: number },
  bundesland: BundeslandCode,
  absenceCorrections: Array<AbsenceCorrection>,
}

type Props = OwnProps & ConProps

class AbsenceCalendar extends PureComponent {
  props: Props

  render() {
    const {
      users,
      absences,
      year,
      month,
      branch,
      adminMode,
      absenceSums,
      type,
      positions,
      bundesland,
      absenceCorrections,
      currentVacDays } = this.props

    return(
      <fb className="absenceCalendarMain">
        <CalendarHead
          year={year}
          month={month}
          type={type}
          adminMode={adminMode}
          bundesland={bundesland}
        />
        <CalendarBody
          branch={branch}
          year={year}
          month={month}
          type={type}
          absences={absences}
          absenceSums={absenceSums}
          users={users}
          adminMode={adminMode}
          positions={positions}
          currentVacDays={currentVacDays}
          absenceCorrections={absenceCorrections}
        />
      </fb>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => {
  const currentBranch = state.ui.absence.currentBranch
  return {
    users: state.core.users.filter(u => currentBranch === 'all' || u.branches[currentBranch]),
    positions: state.core.positions,
    branch: currentBranch,
    year: state.ui.absence.currentYear,
    month: state.ui.absence.currentMonth,
    type: state.ui.absence.currentType,
    currentVacDays: getCurrentVacDays(state),
    absenceCorrections: state.absencePlaner.absenceCorrections.filter(a => a.year === state.ui.absence.currentYear),
    bundesland: (state.core.accountDetails.preferences.bundesland: any),
  }
}

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(AbsenceCalendar)
