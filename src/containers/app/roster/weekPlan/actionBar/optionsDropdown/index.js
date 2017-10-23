//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Shifts } from 'types/index'

import ImportTemplateModal from 'components/modals/importTemplateModal'
import ConfirmPopup from 'components/confirmPopup'
import SPopover from 'components/sPopover'
import { openModal } from 'actions/ui/modals'
import { enterExtraHoursMode } from 'actions/ui/roster'

import './styles.css'

type OwnProps = {}
type ConProps = {
  shifts: Shifts,
  openModal: ActionCreator,
  enterExtraHoursMode: ActionCreator,
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

  extraHoursClicked = () => {
    // const popupProps = {
    //   title: 'Extrastunden',
    //   text: 'Wählen sie die Zelle aus in der Sie Extrastunden einfügen möchten.',
    //   onAccept: this.props.enterExtraHoursMode
    // }
    this.props.enterExtraHoursMode()
    this.togglePopover()
  }

  onSelect = (value: string) => {
    if(value === 'EXTRA_HOURS') this.extraHoursClicked()
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
          width={180}
          onSelect={this.onSelect}
          options={
            [
              {label: 'Vorlage Importieren', value: 'importTemplate' },
              {label: 'Als Vorlage speichern', value: 'exportAsTemplate' },
              {label: 'Extrastunden', value: 'EXTRA_HOURS' }
            ]
          }
        />
      </fb>
    )
  }
}


const actionCreators = {
  openModal,
  enterExtraHoursMode,
}

const mapStateToProps = (state: Store) => ({
  shifts: state.roster.shiftWeek
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(OptionsDropdown)
