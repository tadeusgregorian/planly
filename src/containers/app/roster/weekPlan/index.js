// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { setRosterListeners } from 'actions/listeners'

import WithMouseEvents from './shiftBoard/withMouseEvents'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import './styles.css'

type Props = {
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

  render(){
    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          <ActionBar />
          <WithMouseEvents>
            <ShiftBoard />
          </WithMouseEvents>
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
