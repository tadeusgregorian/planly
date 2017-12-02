//@flow
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import SPopover from 'components/sPopover'
import './styles.css'

type Props = {
  logout: Function,
  userName: ?string,
  history: any,
}

type State = {
  dropdownOpen: boolean
}

class UserOptions extends PureComponent{
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
    if(action === 'MY_PROFILE') this.props.history.push('/app/profil')
  }

  render(){
    const { userName } = this.props
    const { dropdownOpen } = this.state

    return(
      <fb className="topbarUserOptionsMain" ref={(ref)=>this.ref = ref} onClick={this.toggleDropDown}>
        <fb className='userName'>{userName}</fb>
        <fb className="icon logoutIcon icon-account_box"></fb>
        { dropdownOpen && <SPopover
          targetElement={this.ref}
          width={160}
          onSelect={this.onSelect}
          closePopover={()=>this.setState({dropdownOpen: false})}
          options={
            [
              {label: 'Mein Profil', value: 'MY_PROFILE'},
              {label: 'Ausloggen', value: 'LOGOUT' },
            ]
          } /> }
      </fb>
    )
  }
}

export default withRouter(UserOptions)
