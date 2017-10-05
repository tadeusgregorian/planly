// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'

import { setAbsencesListener } from 'actions/listeners/absencePlaner'
import { handleClicks, absencesFiltered } from './localHelpers'
import { openAbsenceModal } from 'actions/ui/modals'
import getCurrentUser from 'selectors/currentUser'

import type { User, Store, Branch, DataStatus, Absence, AbsenceTypeFilter } from 'types/index'

import AbsenceActionBar from './absenceActionBar'
//import AbsenceListView from './absenceListView'
import AbsenceCalendar from './absenceCalendar'
import './styles.css'

type State = {
  currentBranch: string,
  currentYear: number,
  currentMonth: number,
  absenceType: AbsenceTypeFilter,
}

type OwnProps = {}
type ConProps = {
  rosterBranch: string,
  branches: Array<Branch>,
  currentUser: User,
  absences: Array<Absence>,
  absencesDS: DataStatus,
  openAbsenceModal: (string, string | void )=>{},
  setAbsencesListener: (number)=>any,
}
type Props = OwnProps & ConProps

class AbsencePlaner extends PureComponent {
  state: State
  props: Props

  constructor(props: Props){
    super(props)

    this.state = {
      currentBranch: this.props.rosterBranch, // per default its the branch that was selected in the roster
      currentYear: moment().year(),
      currentMonth: moment().month(),
      absenceType: 'vac',
    }
  }

  componentDidMount = () => {
    handleClicks(this.openAbsenceModal)
    this.props.setAbsencesListener(moment().year())
  }

  componentWillUnmount  = () => handleClicks()

  changeBranch  = (branchID: string)  => this.setState({currentBranch: branchID})
  changeYear    = (year: number)      => this.setState({currentYear: year})
  changeMonth   = (month: number)     => this.setState({currentMonth: month})

  openAbsenceModal = (userID: string, absenceID?: string) => {
    this.props.openAbsenceModal(userID, absenceID)
  }

  render() {
    const { currentBranch, currentYear, currentMonth, absenceType } = this.state
    const { branches, absences, absencesDS } = this.props

    return(
      <fb className="absenceMain">
        <fb className='absenceContent'>
          <AbsenceActionBar
            currentBranch={currentBranch}
            changeBranch={this.changeBranch}
            currentYear={currentYear}
            changeYear={this.changeYear}
            currentMonth={currentMonth}
            changeMonth={this.changeMonth}
            branches={branches}
            absenceType={absenceType}
            changeType={(absenceType) => this.setState({absenceType})}
          />
          {/* <AbsenceListView  /> */}
          <AbsenceCalendar
            branch={currentBranch}
            year={currentYear}
            month={currentMonth}
            absenceType={absenceType}
            absences={absencesFiltered(absences, currentMonth, absenceType)}
            loading={absencesDS !== 'LOADED'}
          />
        </fb>
      </fb>
    )
  }
}

const actionCreators = {
  setAbsencesListener,
  openAbsenceModal,
}

const mapStateToProps = (state: Store) => ({
  rosterBranch: state.ui.roster.currentBranch,
  branches: state.core.branches,
  currentUser: getCurrentUser(state),
  absences: state.absencePlaner.absences,
  absencesDS: state.absencePlaner.absencesDataStatus,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(AbsencePlaner)
