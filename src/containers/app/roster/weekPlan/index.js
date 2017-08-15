// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import { setShiftWeekListener } from 'actions/listeners'
import { removeShiftWeek } from 'actions/index'
import { focusShiftCell } from 'actions/ui'
import './styles.css'

class WeekPlan extends PureComponent{

  componentDidMount = () => {
    this.props.setShiftWeekListener()
  }

  componentWillReceiveProps = (np) => {
    const { currentBranch, removeShiftWeek, setShiftWeekListener, currentSmartWeek } = this.props
    const branchChanged = np.currentBranch !== currentBranch
    const smartWeekChanged = np.currentSmartWeek !== currentSmartWeek
    if(branchChanged || smartWeekChanged){
      removeShiftWeek()
      setShiftWeekListener()
    }
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
          />
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setShiftWeekListener,
  removeShiftWeek,
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
