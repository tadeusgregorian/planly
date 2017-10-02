// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'

import { saveAbsenceToDB } from 'actions/absence'

import { handleClicks } from './localHelpers'
import { openAbsenceModal } from 'actions/ui/modals'
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
  currentUser: User,
  openAbsenceModal: (string, string | void )=>{},
  saveAbsenceToDB: (Absence)=>any,
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

  componentDidMount     = () => handleClicks(this.openAbsenceModal)
  componentWillUnmount  = () => handleClicks()

  changeBranch  = (branchID: string)  => this.setState({currentBranch: branchID})
  changeYear    = (year: number)      => this.setState({currentYear: year})

  openAbsenceModal = (userID: string, absenceID?: string) => {
    this.props.openAbsenceModal(userID, absenceID)
  }

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
        <AbsenceCalendar
          currentBranch={currentBranch}
        />
      </fb>
    )
  }
}

const actionCreators = {
  openAbsenceModal,
  saveAbsenceToDB
}

const mapStateToProps = (state: Store) => ({
  rosterBranch: state.ui.roster.currentBranch,
  branches: state.core.branches,
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(Absence)
