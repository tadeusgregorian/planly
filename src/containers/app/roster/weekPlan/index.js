// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import type { MinimalShift, FocusedCell, Shifts, Note } from 'types/index'
import { setRosterListeners } from 'actions/listeners'
import { focusShiftCell, unfocusShiftCell } from 'actions/ui/roster'
import { writeShiftToDB } from 'actions/roster'
import './styles.css'

type Props = {
  setRosterListeners: ()=>void,
  shiftWeek: Shifts,
  notes: Array<Note>,
  currentBranch: string,
  currentSmartWeek: string,
  focusedCell: FocusedCell,
  unfocusShiftCell: ()=>void,
  focusShiftCell: (FocusedCell)=>void
}

class WeekPlan extends PureComponent{
  props: Props

  componentDidMount = () => this.props.setRosterListeners()

  componentWillReceiveProps = (np: Props) => {
    const { currentBranch, setRosterListeners, currentSmartWeek } = this.props
    const branchChanged = np.currentBranch !== currentBranch
    const smartWeekChanged = np.currentSmartWeek !== currentSmartWeek
    if(branchChanged || smartWeekChanged) setRosterListeners()
  }

  saveShiftToDB = (shift: MinimalShift) => {
    const smartWeek         = this.props.currentSmartWeek
    const branch            = this.props.currentBranch
    const { user, day }     = this.props.focusedCell
    writeShiftToDB(smartWeek, { ...shift, branch, user, day })
    this.props.unfocusShiftCell()
  }

  render(){
    return(
      <fb className="shiftWeekWrapper">
          <fb className='shiftWeekMain'>
            <ActionBar />
            <ShiftBoard
              shifts={this.props.shiftWeek}
              focusShiftCell={this.props.focusShiftCell}
              unfocusShiftCell={this.props.unfocusShiftCell}
              focusedCell={this.props.focusedCell}
              saveShift={this.saveShiftToDB}
              notes={this.props.notes}
            />
          </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setRosterListeners,
  focusShiftCell,
  unfocusShiftCell
}

const mapStateToProps = (state) => ({
  shiftWeek: state.roster.shiftWeek,
  shiftWeekDataStatus: state.roster.shiftWeekDataStatus,
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek,
  focusedCell: state.ui.roster.weekPlan.focusedCell,
  notes: state.roster.notes,
})

export default connect(mapStateToProps, actionsToProps)(WeekPlan)
