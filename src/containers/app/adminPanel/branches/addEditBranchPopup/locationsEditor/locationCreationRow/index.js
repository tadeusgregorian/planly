//@flow
import React, { PureComponent } from 'react'
import cn from 'classnames'

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
  color: string
}

export default class LocationCreationRow extends PureComponent {
  props: Props
  state: State

  constructor(props: Props){
    super(props)

    this.state = {
      name: this.props.location.name,
      color: this.props.location.color
    }
  }

  saveLocation = () => this.props.saveLocation({  id: this.props.location.id, ...this.state })

  render(){
    return(
      <fb className={cn({locationCreationRowMain: 1, creationMode: this.props.onCreation})}>
        <input
          className='nameInput'
          placeholder='Name des Bereichs'
          value={this.state.name}
          onChange={e => this.setState({name: e.target.value})}
          autoFocus />
        <fb className='colorBox icon icon-palette' />
        <fb className='actionButtons'>
          <fb className='btn saveButton' onClick={this.saveLocation}>fertig</fb>
          <fb className='btn cancelButton icon icon-cancel' onClick={this.props.cancelEditing}></fb>
        </fb>
      </fb>
    )
  }
}
