// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Shifts, TemplatesFlat } from 'types/index'
import { setRosterListeners, setInitialRosterListeners } from 'actions/listeners'
import { changeCurrentTemplate } from 'actions/ui/roster'

import WithMouseEvents from '../withMouseEvents'
import ShiftBoard from '../shiftBoard'
import ActionBar from './actionBar'
import TemplateActionBar from './templateActionBar'
import './styles.css'

type OwnProps = {

}

type ConnectedProps = {
  shifts: Shifts,
  currentBranch: string,
  currentSmartWeek: number,
  currentTemplate: string,
  templateMode: boolean,
  templatesFlat: TemplatesFlat,
  changeCurrentTemplate: (string)=>{},
  setRosterListeners: ()=>void,
  setInitialRosterListeners: ()=>void
}

type Props = ConnectedProps & OwnProps

class WeekPlan extends PureComponent{
  props: Props

  componentDidMount = () => {
    this.props.setInitialRosterListeners()
  }

  componentWillReceiveProps = (np: Props) => {
    const { currentBranch, setRosterListeners, currentSmartWeek, templateMode, currentTemplate } = this.props
    const branchChanged   = np.currentBranch    !== currentBranch
    const swChanged       = np.currentSmartWeek !== currentSmartWeek
    const tempChanged     = np.currentTemplate  !== currentTemplate
    const tempModeChanged = np.templateMode     !== templateMode

    if(branchChanged || swChanged || tempModeChanged || tempChanged) setRosterListeners()
  }

  render(){
    const { templateMode } = this.props
    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          { !templateMode ? <ActionBar /> : <TemplateActionBar /> }
          <WithMouseEvents>
            <ShiftBoard shifts={this.props.shifts} templateMode={templateMode}/>
          </WithMouseEvents>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  changeCurrentTemplate,
  setRosterListeners,
  setInitialRosterListeners
}

const mapStateToProps = (state: Store) => ({
  currentBranch: state.ui.roster.currentBranch,
  currentSmartWeek: state.ui.roster.currentSmartWeek,
  currentTemplate: state.ui.roster.currentTemplate,
  templateMode: state.ui.roster.templateMode,
  templatesFlat: state.roster.templatesFlat,
  shifts: state.roster.shiftWeek,
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(WeekPlan)
