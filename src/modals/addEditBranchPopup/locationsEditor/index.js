//@flow
import React, { PureComponent } from 'react'
import { generateGuid } from 'helpers/index'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { openModal } from 'actions/ui/modals'
import _ from 'lodash'
import LocationCreationRow from './locationCreationRow'
import type { Location } from 'types/index'
import './styles.css'

type OwnProps = {
  updateLocation: (Location)=>void,
  deleteLocation: (Location)=>void,
  locations: {[string]: Location}
}

type ConProps = {
  openModal: Function
}

type Props = OwnProps & ConProps

type State = {
  locBeingEdited: string, // the id of the locaction being edited or created
  onCreation: boolean // indicates that a new Location is being created / instead of an existing Loc being edited
}

class LocationEditor extends PureComponent {
  props: Props
  state: State
  freshLocationID: string

  constructor(props: Props){
    super(props)

    this.state = {
      locBeingEdited: '',
      onCreation: false,
    }
  }

  cancelEditing = () => {
    this.setState({ locBeingEdited: '', onCreation: false })
  }

  saveLocation = (loc: Location) => { // just passes it through to parent comp
    this.props.updateLocation(loc)
    this.cancelEditing()
  }

  deleteClicked = (loc) => {
    const props = {
      onAccept: ()=>this.props.deleteLocation(loc),
      acceptBtnLabel: 'Löschen',
      acceptBtnRed: true,
      title: 'Arbeitsbreich löschen',
      text: `Soll der Arbeitsbereich ${loc.name} wirklich gelöscht werden ?`
    }
    this.props.openModal('CONFIRMATION', props)
  }

  getEmptyLoc = () => ({
    id: this.state.locBeingEdited,
    name: '',
    color: 'red'
  })

  renderCreateLocRow = (loc: Location) => (
    <LocationCreationRow
        key={loc.id}
        location={loc}
        saveLocation={this.saveLocation}
        cancelEditing={this.cancelEditing}
        onCreation={this.state.onCreation}
    />
  )

  renderLocationDisplay = (loc: Location) => (
    <fb className='locationDisplay' key={loc.id}>
      <fb className='color' style={{background: loc.color}} />
      <fb className='name'>{loc.name}</fb>
      <fb className='actionButtons'>
        <fb className='btn editBtn icon-pencil icon' onClick={() => this.editLocation(loc.id)} />
        <fb className='btn deleteBtn icon-delete icon' onClick={() => this.deleteClicked(loc)}/>
      </fb>
    </fb>
  )

  editLocation = (locactionID: string) => {
    this.setState({ locBeingEdited: locactionID, onCreation: false })
  }

  addNewLocRow = () => {
    this.setState({ locBeingEdited: generateGuid(), onCreation: true })
  }

  render(){
    const { locations } = this.props

    return(
      <fb className="locationsEditorMain">
        { _.values(locations).filter(loc => !loc.deleted).map(loc => {
          return loc.id === this.state.locBeingEdited
            ? this.renderCreateLocRow(loc)
            : this.renderLocationDisplay(loc)
        }) }
        { this.state.onCreation
          ? this.renderCreateLocRow(this.getEmptyLoc())
          : <fb className='createLocationBtn' onClick={this.addNewLocRow}>+ Bereich anlegen</fb>
        }
      </fb>
    )
  }
}

const actionCreators = {
  openModal
}

const connector: Connector<OwnProps, Props> = connect(null, actionCreators)
export default connector(LocationEditor)
