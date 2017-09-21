//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, TemplatesFlat } from 'types/index'
import TemplateSelect from './templateSelect'

import { changeCurrentWeekID } from 'actions/ui/roster'
import { createNewTempForBranch, saveTemplateName } from 'actions/roster/template'
import './styles.css'

type OwnProps = {}
type ConnectedProps = {
  templatesFlat: TemplatesFlat,
  currentBranch: string,
  currentWeekID: string,
  changeCurrentWeekID: (string) => {},
}
type Props = OwnProps & ConnectedProps

class TemplateActionBar extends PureComponent {

  changeTemplate = (weekID: string) => {
    this.props.changeCurrentWeekID(weekID)
  }

  createTemplate = () => {
    createNewTempForBranch(this.props.currentBranch)
      .then((newTempID) => this.changeTemplate(newTempID))
  }

  render(){
    const { templatesFlat, currentBranch } = this.props
    const tempsFlatOfBranch = templatesFlat.filter(t => t.branch === currentBranch)

    return(
      <fb className="actionBarMain">
        <fb>Vorlage:</fb>
        <TemplateSelect
          templatesFlat={tempsFlatOfBranch}
          currentTemplate={this.props.currentWeekID}
          saveTemplateName={saveTemplateName}
          changeTemplate={this.changeTemplate}
        />
        <fb className='right'>
          <fb className='createTemplateBtn' onClick={this.createTemplate}>
            Neues Template
          </fb>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  changeCurrentWeekID
}

const mapStateToProps = (state: Store) => ({
  templatesFlat: state.roster.templatesFlat,
  currentWeekID: state.ui.roster.currentWeekID,
  currentBranch: state.ui.roster.currentBranch
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionsToProps)
export default connector(TemplateActionBar)
