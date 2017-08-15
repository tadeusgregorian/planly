// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import type { MinimalShift } from 'types/index'
import { setShiftWeekListener } from 'actions/listeners'
import { focusShiftCell } from 'actions/ui'
import { writeShiftToDB } from 'actions/roster'
import './styles.css'

class WeekPlan extends PureComponent{

  componentDidMount = () => this.props.setShiftWeekListener()

  componentWillReceiveProps = (np) => {
    const { currentBranch, setShiftWeekListener, currentSmartWeek } = this.props
    const branchChanged = np.currentBranch !== currentBranch
    const smartWeekChanged = np.currentSmartWeek !== currentSmartWeek
    if(branchChanged || smartWeekChanged) setShiftWeekListener()
  }

  saveShiftToDB = (shift: MinimalShift) => {
    const smartWeek: string = this.props.currentSmartWeek
    const branch: string    = this.props.currentBranch
    const { user, day }     = this.props.focusedCell
    writeShiftToDB(smartWeek, { ...shift, branch, user, day })
  }

  render(){
    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          <ActionBar />
          <ShiftBoard
            shifts={this.props.shiftWeek}
            focusShiftCell={this.props.focusShiftCell}
            focusedCell={this.props.focusedCell}
            saveShift={this.saveShiftToDB}
          />
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setShiftWeekListener,
  focusShiftCell
}

const mapStateToProps = (state) => ({
  shiftWeek: state.roster.shiftWeek,
  shiftWeekDataStatus: state.roster.shiftWeekDataStatus,
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek,
  focusedCell: state.ui.roster.weekPlan.focusedCell
})

export default connect(mapStateToProps, actionsToProps)(WeekPlan)
