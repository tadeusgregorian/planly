// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'
import moment from 'moment'
import { setRosterListeners, setInitialRosterListeners } from 'actions/listeners/roster'
import { setAbsencesListener } from 'actions/listeners/absencePlaner'
import { getYear } from 'helpers/index'
import WithMouseEvents from '../withMouseEvents'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import TemplateActionBar from './templateActionBar'
import type { DataStatus } from 'types/index'
import './styles.css'

type ConnectedProps = {
  currentBranch: string,
  currentWeekID: string,
  templateMode: boolean,
  shiftWeekDataStatus: DataStatus,
  setRosterListeners: ()=>any,
  setInitialRosterListeners: ()=>any,
  setAbsencesListener: (number)=>any,
}

type Props = ConnectedProps

class WeekPlan extends PureComponent{
  props: Props

  componentDidMount = () => {
    this.props.setInitialRosterListeners()
    this.props.setAbsencesListener(moment().year())
  }

  componentWillReceiveProps = (np: Props) => {
    const { currentBranch, setRosterListeners, currentWeekID, templateMode, setAbsencesListener } = this.props
    const branchChanged   = np.currentBranch    !== currentBranch
    const swChanged       = np.currentWeekID    !== currentWeekID
    const modeChanged     = np.templateMode     !== templateMode
    const yearChanged     = getYear(np.currentWeekID) !== getYear(currentWeekID)

    if(branchChanged || swChanged || modeChanged) setRosterListeners()
    if(yearChanged) setAbsencesListener(getYear(np.currentWeekID))
  }

  render(){

    const { templateMode, shiftWeekDataStatus } = this.props
    const shiftsLoaded = shiftWeekDataStatus === 'LOADED'

    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          { !templateMode ? <ActionBar /> : <TemplateActionBar /> }
          <WithMouseEvents>
            <ShiftBoard templateMode={templateMode} loading={!shiftsLoaded} />
          </WithMouseEvents>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  setRosterListeners,
  setInitialRosterListeners,
  setAbsencesListener,
}

const mapStateToProps = (state: Store) => ({
  currentBranch: state.ui.roster.currentBranch,
  currentWeekID: state.ui.roster.currentWeekID,
  templateMode: state.ui.roster.templateMode,
  shiftWeekDataStatus: state.roster.shiftWeekDataStatus,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionsToProps)
export default connector(WeekPlan)
