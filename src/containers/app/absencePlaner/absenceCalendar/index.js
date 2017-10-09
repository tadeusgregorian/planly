// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import CalendarHead from './calendarHead'
import CalendarBody from './calendarBody'
import type { User, Store, Absence } from 'types/index'
import './styles.css'

type OwnProps = {
  absences: Array<Absence>,
  loading: boolean,
  adminMode: boolean,
}

type ConProps = {
  users: Array<User>,
  branch: string,
  year: number,
  month: number
}

type Props = OwnProps & ConProps

class AbsenceCalendar extends PureComponent {
  props: Props

  render() {
    const { users, absences, year, month, branch, adminMode } = this.props

    return(
      <fb className="absenceCalendarMain">
        <CalendarHead year={year} month={month} adminMode={adminMode}/>
        <CalendarBody branch={branch} year={year} month={month} absences={absences} users={users} adminMode={adminMode}/>
      </fb>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => {
  const currentBranch = state.ui.absence.currentBranch
  return {
    users: state.core.users.filter(u => currentBranch === 'all' || u.branches[currentBranch]),
    branch: currentBranch,
    year: state.ui.absence.currentYear,
    month: state.ui.absence.currentMonth
  }
}

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, {})
export default connector(AbsenceCalendar)
