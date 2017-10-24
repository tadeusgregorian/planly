//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store, Shifts } from 'types/index'

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

  importTempClicked = () => this.props.openModal('IMPORT_TEMPLATE')
  saveAsTempClicked = () => this.props.openModal('SAVE_AS_TEMPLATE')
  extraHoursClicked = () => this.props.enterExtraHoursMode()


  onSelect = (value: string) => {
    if(value === 'EXTRA_HOURS')  this.extraHoursClicked()
    if(value === 'SAVE_AS_TEMP') this.saveAsTempClicked()
    if(value === 'IMPORT_TEMP')  this.importTempClicked()
    this.togglePopover()
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
        { this.state.dropdownOpen && <SPopover
          targetElement={this.ref}
          width={180}
          onSelect={this.onSelect}
          closePopover={()=>this.setState({dropdownOpen: false})}
          options={
            [
              {label: 'Vorlage Importieren', value: 'IMPORT_TEMP' },
              {label: 'Als Vorlage speichern', value: 'SAVE_AS_TEMP' },
              {label: 'Extrastunden', value: 'EXTRA_HOURS' }
            ]
          }
        />}
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
