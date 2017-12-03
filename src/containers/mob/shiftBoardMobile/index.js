//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'
import getShiftsFiltered from 'selectors/shiftsFiltered_mobile'
import { setShiftWeekListener_mobile } from 'actions/listeners/roster'
import { setAbsencesListener } from 'actions/listeners/absencePlaner'
import TeamShiftList from './teamShiftList'
import PersonalShiftList from './personalShiftList'
import { getYear } from 'helpers/index'
import type { Store, PlanMode, Shift, DataStatus } from 'types/index'
import './styles.css'

type Props = {
  planMode: PlanMode,
  currentDay: string,
  currentBranch: string,
  currentWeekID: string,
  shiftWeek: Array<Shift>,
  shiftWeekDS: DataStatus,
  setShiftWeekListener_mobile: Function,
  setAbsencesListener: Function,
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


  render(){
    const { shiftWeekDS, planMode, shiftWeek, currentWeekID } = this.props
    const shifts = shiftWeek
    const inTeamMode = planMode === 'TEAM'
    const isLoading = shiftWeekDS !== 'LOADED'

    return(
      <fb className='shiftBoardMobileMain' >
      { inTeamMode
          ? <TeamShiftList {...{ shifts, isLoading }} />
          : <PersonalShiftList {...{ shifts }} weekID={currentWeekID} />
      }
      <fb className={cn({loadingLayer: 1, isLoading })}>loading...</fb>
      </fb>
    )
  }
}

const actionCreators = {
  setShiftWeekListener_mobile,
  setAbsencesListener,
}

const mapStateToProps = (state: Store) => ({
  planMode: state.ui.roster.planMode,
  currentDay: state.ui.roster.currentDay,
  currentBranch: state.ui.roster.currentBranch,
  currentWeekID: state.ui.roster.currentWeekID,
  shiftWeek: getShiftsFiltered(state),
  shiftWeekDS: state.roster.shiftWeekDataStatus,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(ShiftBoardMobile)
