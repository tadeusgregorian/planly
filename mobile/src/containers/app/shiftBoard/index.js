//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'
import getShiftsFiltered from 'selectors/shiftsFiltered'
import { setShiftWeekListener, setWeeklyAbsencesListener } from 'actions/listeners/roster'
import TeamShiftList from './teamShiftList'
import PersonalShiftList from './personalShiftList'
import type { Store, PlanMode, Shift, DataStatus } from 'types/index'
import './styles.css'

type Props = {
  planMode: PlanMode,
  currentDay: string,
  currentBranch: string,
  currentWeekID: string,
  shiftWeek: Array<Shift>,
  shiftWeekDS: DataStatus,
  weekAbsencesDS: DataStatus,
  setShiftWeekListener: Function,
  setWeeklyAbsencesListener: Function,
}

class ShiftBoard extends PureComponent {

  componentDidMount = () => {
    this.props.setShiftWeekListener()
    this.props.setWeeklyAbsencesListener()

  }

  componentWillReceiveProps = (np: Props) => {
    const {
      currentBranch,
      currentWeekID,
      planMode,
      currentDay,
      setWeeklyAbsencesListener,
      setShiftWeekListener } = this.props

    const branchChanged   = np.currentBranch    !== currentBranch
    const swChanged       = np.currentWeekID    !== currentWeekID
    const modeChanged     = np.planMode         !== planMode
    const dayChanged      = np.currentDay       !== currentDay

    if(branchChanged || swChanged || modeChanged || dayChanged) setShiftWeekListener()
    if(swChanged) setWeeklyAbsencesListener()
  }


  render(){
    const { shiftWeekDS, weekAbsencesDS, planMode, shiftWeek, currentWeekID } = this.props
    const shifts = shiftWeek
    const inTeamMode = planMode === 'TEAM'
    const isLoading = shiftWeekDS !== 'LOADED' || weekAbsencesDS !== 'LOADED'

    return(
      <fb className='shiftBoardMain' >
      { inTeamMode
          ? <TeamShiftList {...{ shifts }} />
          : <PersonalShiftList {...{ shifts }} weekID={currentWeekID} />
      }
      <fb className={cn({loadingLayer: 1, isLoading })}>loading...</fb>
      </fb>
    )
  }
}

const actionCreators = {
  setShiftWeekListener,
  setWeeklyAbsencesListener,
}

const mapStateToProps = (state: Store) => ({
  planMode: state.ui.roster.planMode,
  currentDay: state.ui.roster.currentDay,
  currentBranch: state.ui.roster.currentBranch,
  currentWeekID: state.ui.roster.currentWeekID,
  shiftWeek: getShiftsFiltered(state),
  weekAbsences: state.roster.weekAbsences,
  shiftWeekDS: state.roster.shiftWeekDataStatus,
  weekAbsencesDS: state.roster.weekAbsencesDataStatus,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(ShiftBoard)
