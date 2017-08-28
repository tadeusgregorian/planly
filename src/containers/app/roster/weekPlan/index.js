// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'
import { setRosterListeners, setInitialRosterListeners } from 'actions/listeners'

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
  setRosterListeners: ()=>void,
  setInitialRosterListeners: ()=>void
}

type Props = ConnectedProps & OwnProps

class WeekPlan extends PureComponent{
  props: Props

  componentDidMount = () => { this.props.setInitialRosterListeners() }

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
  setRosterListeners,
  setInitialRosterListeners
}

const mapStateToProps = (state: Store) => ({
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(WeekPlan)
