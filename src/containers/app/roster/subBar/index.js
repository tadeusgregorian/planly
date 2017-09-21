// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Store } from 'types/index'
import { NavLink } from 'react-router-dom'
import {
  changeCurrentBranch,
  leaveTemplateMode,
  enterTemplateMode,
} from 'actions/ui/roster'
import Dropdown from 'react-dropdown'
import './styles.css'


class SubBar extends PureComponent {

  weekPlanClicked = () => {
    this.props.leaveTemplateMode()
  }

  templatesClicked = () => {
    this.props.enterTemplateMode()
  }

  render(){
    const { currentBranch, changeCurrentBranch, branches } = this.props
    const currentBranchName = branches.find(b => b.id === currentBranch).name
    return(
      <fb className="rosterSubBarMain">
        <fb className='centered'>
          <fb className='subBarButton branchSelector'>
            <Dropdown
              value={{value: currentBranch, label: currentBranchName}}
              options={branches.map(b => ({value: b.id, label: b.name}))}
              onChange={(opt) => changeCurrentBranch(opt.value)}
            />
          </fb>
          <NavLink to='/app/dienstplan/wochenplan'>
            <fb className='subBarButton' onClick={this.weekPlanClicked}>Wochenplan</fb>
          </NavLink>
          <NavLink to='/app/dienstplan/wochenplan'>
            <fb className='subBarButton' onClick={this.templatesClicked}>Vorlagen</fb>
          </NavLink>
          <NavLink to='/app/dienstplan/overtime'>
            <fb className='subBarButton'>Überstunden</fb>
          </NavLink>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  changeCurrentBranch,
  leaveTemplateMode,
  enterTemplateMode
}

const mapStateToProps = (state: Store) => ({
  currentBranch: state.ui.roster.currentBranch,
  branches: state.core.branches,
  templatesFlat: state.roster.templatesFlat,
})

export default connect (mapStateToProps, actionsToProps)(SubBar)
