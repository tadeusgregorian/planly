// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'
import getCurrentUser from 'selectors/currentUser'

import type { User, Store, Branch } from 'types/index'

import AbsenceActionBar from './absenceActionBar'
//import AbsenceListView from './absenceListView'
import AbsenceCalendar from './absenceCalendar'
import './styles.css'

type State = {
  view: 'calendar' | 'list',
  currentBranch: string,
  currentYear: number
}

type OwnProps = {}
type ConProps = {
  rosterBranch: string,
  branches: Array<Branch>,
  currentUser: User
}
type Props = OwnProps & ConProps

class Absence extends PureComponent {
  state: State
  props: Props

  state = {
    view: 'calendar',
    currentBranch: this.props.rosterBranch, // per default its the branch that was selected in the roster
    currentYear: moment().year()
  }

  changeBranch = (branchID: string) => this.setState({currentBranch: branchID})
  changeYear = (year: number) => this.setState({currentYear: year})

  render() {
    const { currentBranch, currentYear, view } = this.state
    const { branches } = this.props

    return(
      <fb className="absenceMain">
        <AbsenceActionBar
          currentBranch={currentBranch}
          changeBranch={this.changeBranch}
          currentYear={currentYear}
          changeYear={this.changeYear}
          branches={branches}
          view={view}
          changeView={(view) => this.setState({view})}
        />
        {/* <AbsenceListView  /> */}
        <AbsenceCalendar currentBranch={currentBranch} />
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  rosterBranch: state.ui.roster.currentBranch,
  branches: state.core.branches,
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(Absence)
