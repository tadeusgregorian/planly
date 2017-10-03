// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import CalendarHead from './calendarHead'
import CalendarBody from './calendarBody'
import type { User, Store, Absence } from 'types/index'
import './styles.css'

type OwnProps = {
  branch: string,
  absences: Array<Absence>,
  loading: boolean,
  year: number,
  month: number,
}

type ConProps = {
  users: Array<User>
}

type Props = OwnProps & ConProps

class AbsenceCalendar extends PureComponent {
  props: Props

  render() {
    const { users, absences, year, month, branch } = this.props

    return(
      <fb className="absenceCalendarMain">
        <CalendarHead year={year} month={month}/>
        <CalendarBody branch={branch} year={year} month={month} absences={absences} users={users}/>
      </fb>
    )
  }
}

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  users: state.core.users.filter(u => u.branches[ownProps.branch])
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, {})
export default connector(AbsenceCalendar)
