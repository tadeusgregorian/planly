// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'

import { closestWithAttribute, smartToMom } from 'helpers/index'
import { setAbsencesListener } from 'actions/listeners/absencePlaner'
import { getClickedAbsenceID, getClickedUserID, absencesFiltered } from './localHelpers'
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
  openAbsenceModal: (string, (Absence | void))=>{},
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
    document.addEventListener('click', this.clickDetected)
    this.props.setAbsencesListener(moment().year())
  }

  componentWillUnmount  = () => {
    document.removeEventListener('click', this.clickDetected)
  }

  clickDetected = (e: any) => {
    const adminMode     = this.props.currentUser.isAdmin
    const userID        = getClickedUserID(e) // when a userCell gets clicked
    const absenceID     = getClickedAbsenceID(e) // when an absenceBar gets clicked
    const absence       = absenceID && this.props.absences.find(a => a.id === absenceID)
    const isOwnAbsence  = absence && absence.user === this.props.currentUser.id
    userID  && (adminMode) && openAbsenceModal(userID) // only admin can open absenceModal like this
    absence && (adminMode || isOwnAbsence) && openAbsenceModal(absence.user, absence) // nonAdmin can only open own Absence
  }

  changeBranch  = (branchID: string)  => this.setState({currentBranch: branchID})
  changeYear    = (year: number)      => this.setState({currentYear: year})
  changeMonth   = (month: number)     => this.setState({currentMonth: month})

  openAbsenceModal = (userID: string, absence?: Absence) => {
    this.props.openAbsenceModal(userID, absence)
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
