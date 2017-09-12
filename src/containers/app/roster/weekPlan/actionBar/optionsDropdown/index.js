//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Shifts } from 'types/index'

import ImportTemplateModal from 'components/modals/importTemplateModal'
import SPopover from 'components/sPopover'
import { openModal } from 'actions/ui/modals'

import './styles.css'

type OwnProps = {}
type ConProps = {
  shifts: Shifts,
  openModal: ActionCreator,
}
type Props = OwnProps & ConProps

type State = { dropdownOpen: boolean }

class OptionsDropdown extends PureComponent {
  constructor(props){
    super(props)

    this.state = { dropdownOpen: false }
  }

  state: State
  ref: HTMLElement

  importTempClicked = () => {
    this.props.openModal('importTemplate', ImportTemplateModal)
    this.setState({ dropdownOpen: false })
  }

  onSelect = (value: string) => {
    console.log(value);
  }

  togglePopover = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  render(){
    return(
      <fb className="optionsDropdownMain">
        <fb className='optionsButton' onClick={this.togglePopover} ref={(ref)=>this.ref = ref}>
          aktionen
        </fb>
        <SPopover
          open={this.state.dropdownOpen}
          targetElement={this.ref}
          width={200}
          onSelect={this.onSelect}
          options={
            [
              {lable: 'Vorlage Importieren', value: 'importTemplate' },
              {lable: 'Als Vorlage speichern', value: 'exportAsTemplate' }
            ]
          }
        />
      </fb>
    )
  }
}


const actionCreators = {
  openModal
}

const mapStateToProps = (state: Store) => ({
  shifts: state.roster.shiftWeek
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(OptionsDropdown)
