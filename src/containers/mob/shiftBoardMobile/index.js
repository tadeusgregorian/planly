//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
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

type Props = {
  planMode: PlanMode,
  currentDay: string,
  currentBranch: string,
  currentWeekID: string,
  shiftWeek: Array<Shift>,
  shiftWeekDS: DataStatus,
  focusedShift: ?string,
  currentUser: User,
  setShiftWeekListener_mobile: Function,
  setAbsencesListener: Function,
  focusShift: (shiftID: string)=>any
}

class ShiftBoardMobile extends PureComponent {

  componentDidMount = () => {
    this.props.setShiftWeekListener_mobile()
    this.props.setAbsencesListener(moment().year())
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


  render(){
    const { shiftWeekDS, planMode, shiftWeek, currentWeekID, focusedShift } = this.props
    const shifts = shiftWeek
    const inTeamMode = planMode === 'TEAM'
    const isLoading = shiftWeekDS !== 'LOADED'

    return(
      <fb className='shiftBoardMobileMain' >
      { inTeamMode
          ? <TeamShiftList
              {...{ shifts, isLoading, focusedShift }}
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
  focusedShift: state.ui.roster.mobile.focusedShift
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(ShiftBoardMobile)
