//@flow
import React, { PureComponent } from 'react'
import { generateGuid } from 'helpers/index'

import _ from 'lodash'
import LocationCreationRow from './locationCreationRow'
import type { Location } from 'types/index'
import './styles.css'

type Props = {
  updateLocation: (Location)=>void,
  deleteLocation: (string)=>void,
  locations: {[string]: Location}
}
type State = {
  locBeingEdited: string, // the id of the locaction being edited or created
  onCreation: boolean // indicates that a new Location is being created / instead of an existing Loc being edited
}

export default class LocationEditor extends PureComponent {
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
      <fb className='icon icon-download locationIcon' />
      <fb className='name'>{loc.name}</fb>
      <fb className='color' style={{background: loc.color}} />
      <fb className='actionButtons'>
        <fb className='btn editBtn icon-pencil icon' onClick={() => this.editLocation(loc.id)} />
        <fb className='btn deleteBtn icon-delete icon' onClick={() => this.props.deleteLocation(loc.id)}/>
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
        { _.values(locations).map(loc => {
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
