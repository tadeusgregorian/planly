// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import AbsenceRow from './absenceRow'
import type { User, Store, Absence } from 'types/index'

import './styles.css'

type OwnProps = {
  branch: string,
  year: number,
  month: number,
  absences: Array<Absence>,
}

type ConProps = {
  users: Array<User>,
}

type Props = OwnProps & ConProps

class CalendarBody extends PureComponent {
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

const mapStateToProps = (state: Store, ownProps: OwnProps) => ({
  users: state.core.users.filter(u => u.branches[ownProps.branch])
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(CalendarBody)
