// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'
import getCurrentUser from 'selectors/currentUser'
import {
  changeCurrentBranch,
  leaveTemplateMode,
  enterTemplateMode,
} from 'actions/ui/roster'
import Dropdown from 'react-dropdown'
import type { Store, Branch, User } from 'types/index'
import './styles.css'

type Props = {
  currentBranch: string,
  branches: Array<Branch>,
  templateMode: boolean,
  currentUser: User,
  changeCurrentBranch: Function,
  leaveTemplateMode: Function,
  enterTemplateMode: Function
}

class SubBar extends PureComponent {
  props: Props

  weekPlanClicked = () => {
    this.props.leaveTemplateMode()
  }

  templatesClicked = () => {
    if(false) console.log('what'); // just a random test
    this.props.enterTemplateMode()
  }

  render(){
    const { currentBranch, changeCurrentBranch, branches, templateMode, currentUser } = this.props
    const branchObj: Branch = (branches.find(b => b.id === currentBranch): any)
    const currentBranchName = branchObj.name
    const isAdmin = currentUser.isAdmin

    return(
      <fb className="rosterSubBarMain">
        <fb className='centered'>
          { branches.length > 1 &&
            <fb className='branchSelector'>
              <Dropdown
                value={{value: currentBranch, label: currentBranchName}}
                options={branches.map(b => ({value: b.id, label: b.name}))}
                onChange={(opt) => changeCurrentBranch(opt.value)}
              />
            </fb>
          }
          <fb className={cn({navigation: 1, hidden: !isAdmin})}>
            <fb
              className={cn({subBarButton: 1, activeBlue: !templateMode })}
              onClick={this.weekPlanClicked}>Wochenplan</fb>
            <fb
              className={cn({subBarButton: 1, activePink: templateMode })}
              onClick={this.templatesClicked}>Vorlagen</fb>
          </fb>
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
  templateMode: state.ui.roster.templateMode,
  currentUser: getCurrentUser(state)
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionsToProps)
export default connector(SubBar)
