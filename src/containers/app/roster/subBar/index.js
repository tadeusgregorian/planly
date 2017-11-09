// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import type { Store } from 'types/index'
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
    const { currentBranch, changeCurrentBranch, branches, templateMode } = this.props
    const currentBranchName = branches.find(b => b.id === currentBranch).name
    return(
      <fb className="rosterSubBarMain">
        <fb className='centered'>
          <fb className='branchSelector'>
            <Dropdown
              value={{value: currentBranch, label: currentBranchName}}
              options={branches.map(b => ({value: b.id, label: b.name}))}
              onChange={(opt) => changeCurrentBranch(opt.value)}
            />
          </fb>
          <fb
            className={cn({subBarButton: 1, activeBlue: !templateMode})}
            onClick={this.weekPlanClicked}>Wochenplan</fb>
          <fb
            className={cn({subBarButton: 1, activePink: templateMode})}
            onClick={this.templatesClicked}>Vorlagen</fb>
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
  templateMode: state.ui.roster.templateMode,
})

export default connect (mapStateToProps, actionsToProps)(SubBar)
