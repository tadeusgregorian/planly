// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import type { Shift, Note } from 'types/index'
import { setRosterListeners } from 'actions/listeners'
import { writeShiftToDB } from 'actions/roster'
import './styles.css'

type Props = {
  notes: Array<Note>,
  currentBranch: string,
  currentSmartWeek: string,
  setRosterListeners: ()=>void,
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

  saveShiftToDB = (shift: Shift) => {
    const smartWeek         = this.props.currentSmartWeek
    const branch            = this.props.currentBranch
    writeShiftToDB(smartWeek, { ...shift, branch })
  }

  render(){
    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          <ActionBar />
          <ShiftBoard  saveShift={this.saveShiftToDB} />
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setRosterListeners
}

const mapStateToProps = (state) => ({
  shiftWeekDataStatus: state.roster.shiftWeekDataStatus,
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek,
})

export default connect(mapStateToProps, actionsToProps)(WeekPlan)
