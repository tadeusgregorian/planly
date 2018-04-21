//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { withRouter} from 'react-router-dom'
import moment from 'moment'
import cn from 'classnames'
import getShiftsFiltered from 'selectors/shiftsFiltered_mobile'
import { setShiftWeekListener_mobile } from 'actions/listeners/roster'
import { setAbsencesListener } from 'actions/listeners/absencePlaner'
import getCurrentUser from 'selectors/currentUser'
import TeamShiftList from './teamShiftList'
import PersonalShiftList from './personalShiftList'
import { getYear } from 'helpers/index'
import type { Store, PlanMode, Shift, DataStatus, User } from 'types/index'
import './styles.css'

type OwnProps = {
  history: any
}

type ConProps = {
  planMode: PlanMode,
  currentDay: string,
  currentBranch: string,
  currentWeekID: string,
  shiftWeek: Array<Shift>,
  shiftWeekDS: DataStatus,
  absencesDS: DataStatus,
  focusedShift: ?string,
  currentUser: User,
  setShiftWeekListener_mobile: Function,
  setAbsencesListener: Function,
  focusShift: (shiftID: string)=>any
}

type Props = OwnProps & ConProps

class ShiftBoardMobile extends PureComponent {

  componentDidMount = () => {
    const { shiftWeekDS, absencesDS, setShiftWeekListener_mobile, setAbsencesListener } = this.props

    shiftWeekDS === 'NOT_REQUESTED' && setShiftWeekListener_mobile()
    absencesDS === 'NOT_REQUESTED' && setAbsencesListener(moment().year())
  }

  componentWillReceiveProps = (np: Props) => {

    const {
      currentBranch,
      currentWeekID,
      planMode,
      currentDay,
      setAbsencesListener,
      setShiftWeekListener_mobile } = this.props

    const branchChanged   = np.currentBranch          !== currentBranch
    const swChanged       = np.currentWeekID          !== currentWeekID
    const modeChanged     = np.planMode               !== planMode
    const dayChanged      = np.currentDay             !== currentDay
    const yearChanged     = getYear(np.currentWeekID) !== getYear(currentWeekID)

    if(branchChanged || swChanged || modeChanged || dayChanged) setShiftWeekListener_mobile()
    if(yearChanged) setAbsencesListener(getYear(np.currentWeekID))
  }

  shiftClicked = (shiftID) => {
    const { currentUser, shiftWeek } = this.props
    const shift: Shift = (shiftWeek.find(s => s.id === shiftID): any)
    if(currentUser.isAdmin || shift.user === currentUser.id ){
      this.props.focusShift(shiftID)
    }
  }

  addShiftClicked = () => this.props.history.push('/mob/addEditShift/new')

  render(){
    const { shiftWeekDS, planMode, shiftWeek, currentWeekID, focusedShift, currentUser } = this.props
    const shifts = shiftWeek
    const inTeamMode = planMode === 'TEAM'
    const isLoading = shiftWeekDS !== 'LOADED'
    const isAdmin = !!currentUser.isAdmin

    return(
      <fb className='shiftBoardMobileMain' >
      { inTeamMode
          ? <TeamShiftList
              {...{ shifts, isLoading, focusedShift }}
              isAdmin={isAdmin}
              addShiftClicked={this.addShiftClicked}
              shiftClicked={this.shiftClicked}  />
          : <PersonalShiftList
              {...{ shifts, focusedShift }}
              weekID={currentWeekID}
              shiftClicked={this.shiftClicked} />
      }
      <fb className={cn({loadingLayer: 1, isLoading })}>loading...</fb>
      </fb>
    )
  }
}

const actionCreators = {
  setShiftWeekListener_mobile,
  setAbsencesListener,
  focusShift: (id) => ({ type: 'FOCUS_SHIFT_MOB', payload: id })
}

const mapStateToProps = (state: Store) => ({
  planMode: state.ui.roster.planMode,
  currentUser: getCurrentUser(state),
  currentDay: state.ui.roster.currentDay,
  currentBranch: state.ui.roster.currentBranch,
  currentWeekID: state.ui.roster.currentWeekID,
  shiftWeek: getShiftsFiltered(state),
  shiftWeekDS: state.roster.shiftWeekDataStatus,
  absencesDS: state.absencePlaner.absencesDataStatus,
  focusedShift: state.ui.mobile.focusedShift
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default withRouter(connector(ShiftBoardMobile))
