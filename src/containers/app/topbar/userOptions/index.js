//@flow
import React, { PureComponent } from 'react'
import SPopover from 'components/sPopover'
import './styles.css'

type Props = {
  logout: Function,
  userName: ?string
}

type State = {
  dropdownOpen: boolean
}

export default class  extends PureComponent{
  state: State
  ref: HTMLElement

  constructor(props: Props){
    super(props)

    this.state = { dropdownOpen: false }
  }

  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen })
  }

  onSelect = (action: string) => {
    if(action === 'LOGOUT') this.props.logout()
  }

  render(){
    const { userName } = this.props
    const { dropdownOpen } = this.state

    return(
      <fb className="topbarUserOptionsMain">
        <fb className='userName'>{userName}</fb>
        <fb className="icon logoutIcon icon-account_box" ref={(ref)=>this.ref = ref} onClick={this.toggleDropDown} ></fb>
        { dropdownOpen && <SPopover
          targetElement={this.ref}
          width={120}
          onSelect={this.onSelect}
          closePopover={()=>this.setState({dropdownOpen: false})}
          options={
            [
              {label: 'ausloggen', value: 'LOGOUT' }
            ]
          } /> }
      </fb>
    )
  }
}
