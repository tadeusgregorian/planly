// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { State } from 'types/index'
import { setRosterListeners } from 'actions/listeners'

import WithMouseEvents from './shiftBoard/withMouseEvents'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import './styles.css'

type OwnProps = {
  test: string
}

type ConnectedProps = {
  currentBranch: string,
  currentSmartWeek: number,
  setRosterListeners: ()=>void
}

type Props = ConnectedProps & OwnProps

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

const mapStateToProps = (state: State) => ({
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(WeekPlan)
