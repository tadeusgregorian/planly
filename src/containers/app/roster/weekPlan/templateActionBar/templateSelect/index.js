//@flow
import React, { PureComponent } from 'react'
import type { TemplatesFlat } from 'types/index'
import Dropdown from 'react-dropdown'

import './styles.css'

type Props = {
  templatesFlat: TemplatesFlat,
  currentTemplate: string,
  saveTemplateName: (string, string)=>void,
  changeTemplate: (string)=>void
}

type State = {
  editNameMode: boolean,
  nameInput: string
}

export default class TemplateSelect extends PureComponent{
  state: State;
  constructor(props:Props){
    super(props)

    this.state = {
      editNameMode: false,
      nameInput: ''
    }
  }

  enterEditNameMode = () => this.setState({editNameMode: true})
  leaveEditNameMode = () => this.setState({editNameMode: false, nameInput: '' })
  saveButtonClicked = () => {
    const { saveTemplateName, currentTemplate } = this.props
    const { nameInput } = this.state
    saveTemplateName(currentTemplate, nameInput)
    this.leaveEditNameMode()
  }

  render(){
    const { currentTemplate, templatesFlat, changeTemplate } = this.props
    const currentTempObj = templatesFlat.find(t => t.id === currentTemplate)
    const currentTempName = currentTempObj && currentTempObj.name

    if(!currentTemplate || !templatesFlat.length) return (<fb>loading...</fb>)

    return(
      <fb className='templateSelectMain'>
        { this.state.editNameMode ?
          <fb className='editNameWrapper'>
            <input
              className='nameInput'
              type='text'
              value={this.state.nameInput}
              placeholder={currentTempName}
              onKeyDown={(e)=> { if(e.key === 'Enter') this.saveButtonClicked() }}
              onChange={({target})=>{this.setState({nameInput: target.value })}}
            />
            <fb className='saveBtn' onClick={this.saveButtonClicked}>speichern</fb>
            <fb className='cancelBtn' onClick={this.leaveEditNameMode}>abbrechen</fb>
          </fb> :
          <fb className='selectWrapper'>
            <Dropdown
              value={{value: currentTemplate, label: currentTempName}}
              options={templatesFlat.map(t => ({value: t.id, label: t.name}))}
              onChange={(option) => changeTemplate(option.value)}
            />
            <fb className='icon icon-pencil pencilIcon' onClick={this.enterEditNameMode}></fb>
          </fb>
        }
      </fb>
    )
  }
}
