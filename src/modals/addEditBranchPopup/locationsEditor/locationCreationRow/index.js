//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'

import ColorPicker from 'components/colorPicker'
import type { Location } from 'types/index'
import './styles.css'

type Props = {
  location: Location,
  saveLocation: (Location)=>any,
  cancelEditing: ()=>any,
  onCreation: boolean
}

type State = {
  name: string,
  color: string,
  colorPickerOpen: boolean
}

export default class LocationCreationRow extends PureComponent {
  props: Props
  state: State

  constructor(props: Props){
    super(props)

    this.state = {
      name: this.props.location.name,
      color: this.props.location.color,
      colorPickerOpen: false
    }
  }

  saveLocation = () => {
    const { id } = this.props.location
    const { name, color } = this.state
    this.props.saveLocation({  id, name, color })
  }

  openColorPicker = () => {
    this.setState({colorPickerOpen: true})
  }

  onColorPicked = (color: string) => {
    this.setState({ color })
  }

  render(){
    const { color } = this.state

    return(
      <fb className={cn({locationCreationRowMain: 1, creationMode: this.props.onCreation})}>
        <fb id='locationColorBox' className='colorBox icon icon-palette' style={{backgroundColor: color}} onClick={this.openColorPicker} />
        <ColorPicker targetID='locationColorBox' onPick={this.onColorPicked} />
        <input
          className='nameInput'
          placeholder='Name des Bereichs'
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
          autoFocus />
        <fb className='actionButtons'>
          <fb className='btn saveButton' onClick={this.saveLocation}>fertig</fb>
          <fb className='btn cancelButton icon icon-cancel' onClick={this.props.cancelEditing}></fb>
        </fb>
      </fb>
    )
  }
}
