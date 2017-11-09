// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Shifts } from 'types/index'
import { setRosterListeners, setInitialRosterListeners } from 'actions/listeners/roster'

import WithMouseEvents from '../withMouseEvents'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import TemplateActionBar from './templateActionBar'
import type { DataStatus } from 'types/index'
import './styles.css'

type ConnectedProps = {
  shifts: Shifts,
  currentBranch: string,
  currentWeekID: string,
  templateMode: boolean,
  shiftWeekDataStatus: DataStatus,
  setRosterListeners: ()=>any,
  setInitialRosterListeners: ()=>any
}

type Props = ConnectedProps

class WeekPlan extends PureComponent{
  props: Props

  componentDidMount = () => {
    this.props.setInitialRosterListeners()
  }

  componentWillReceiveProps = (np: Props) => {
    const { currentBranch, setRosterListeners, currentWeekID, templateMode } = this.props
    const branchChanged   = np.currentBranch    !== currentBranch
    const swChanged       = np.currentWeekID    !== currentWeekID
    const modeChanged     = np.templateMode     !== templateMode

    if(branchChanged || swChanged || modeChanged) setRosterListeners()
  }

  render(){

    const { templateMode, shiftWeekDataStatus } = this.props
    const shiftsLoaded = shiftWeekDataStatus === 'LOADED'

    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          { !templateMode ? <ActionBar /> : <TemplateActionBar /> }
          <WithMouseEvents>
            <ShiftBoard shifts={this.props.shifts} templateMode={templateMode} loading={!shiftsLoaded} />
          </WithMouseEvents>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setRosterListeners,
  setInitialRosterListeners
}

const mapStateToProps = (state: Store) => ({
  currentBranch: state.ui.roster.currentBranch,
  currentWeekID: state.ui.roster.currentWeekID,
  templateMode: state.ui.roster.templateMode,
  shifts: state.roster.shiftWeek,
  shiftWeekDataStatus: state.roster.shiftWeekDataStatus,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionsToProps)
export default connector(WeekPlan)
