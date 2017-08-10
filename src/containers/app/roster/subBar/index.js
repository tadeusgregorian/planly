// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { changeCurrentBranch } from 'actions/ui'
import Select from 'react-select'
import './styles.css'


class SubBar extends PureComponent {

  render(){
    return(
      <fb className="rosterSubBarMain">
        <fb className='centered'>
          <fb className='subBarButton branchSelector'>
            <Select
              clearable={false}
              value={this.props.currentBranch}
              options={this.props.branches.map(b => ({value: b.id, label: b.name}))}
              valueRenderer={(opt) => (<fb style={{ }}>{opt.label}</fb>)}
              onChange={(opt) => this.props.changeCurrentBranch(opt.value)}
              searchable={false}
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
