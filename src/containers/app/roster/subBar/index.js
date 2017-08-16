// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { changeCurrentBranch } from 'actions/ui/roster'
import Dropdown from 'react-dropdown'
import './styles.css'


class SubBar extends PureComponent {

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
          <fb className='subBarButton'>Wochenplan</fb>
          <fb className='subBarButton'>Vorlagen</fb>
          <fb className='subBarButton'>Überstunden</fb>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  changeCurrentBranch
}

const mapStateToProps = (state) => ({
  currentBranch: state.ui.roster.currentBranch,
  branches: state.core.branches
})

export default connect (mapStateToProps, actionsToProps)(SubBar)
