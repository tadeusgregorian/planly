//@flow
import React, { PureComponent } from 'react'
import firebase from 'firebase'

import Headline from '../components/headline'
import InputMinimal from 'components/inputMinimal'
import { Toast } from 'helpers/iziToast'

import type { User } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User
}

type State = {
  oldPassword: string,
  password1: string,
  password2: string,
  loading: boolean,
  errorMsg: string,
}

export default class EmailEdit extends PureComponent {
  props: Props
  state: State

  constructor(props: Props){
    super(props)
    this.state = {
      oldPassword: '',
      password1: '',
      password2: '',
      loading: false,
      errorMsg: '',
    }
  }

  cleanInputs = () => {
    this.setState({ oldPassword: '', password1: '', password2: '', loading: false })
  }

  submit = () => {
    const { oldPassword , password1, password2 } = this.state

    if( password1 !== password2 ) return this.setState({ errorMsg: 'Neues Passwort nicht 2x identisch.' })

    this.setState({ loading: true, errorMsg: '' })
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email , oldPassword)
    user.reauthenticateWithCredential(credential)
      .then(() => user.updatePassword(password1))
      .then(() => {
        Toast.success('Passwot erfolgreich geändert')
        this.cleanInputs()
      })
      .catch((e) => {
        this.setState({ errorMsg: e.message })
        this.cleanInputs()
      })
  }

  render(){
    const { oldPassword, password1, password2, loading, errorMsg } = this.state

    return(
      <fb className="profileEmailEditMain">
        <Headline title='Passwort ändern' />
        <fb className='content'>
          <fb className='errorBarWrapper'>
            { errorMsg && <fb className='errorBar'>{errorMsg}</fb> }
          </fb>
          <fb className='inpRow'>
            <fb className='label'>Aktuelles Passwort:</fb>
            <InputMinimal value={oldPassword} width={230} password icon='lock' onInputChange={(oldPassword)=>this.setState({ oldPassword })}/>
          </fb>
          <fb className='inpRow'>
            <fb className='label'>Neues Passwort:</fb>
            <InputMinimal value={password1} width={230} password icon='lock' onInputChange={(password1)=>this.setState({ password1 })}/>
          </fb>
          <fb className='inpRow'>
            <fb className='label'>Neues Passwort wiederholen:</fb>
            <InputMinimal value={password2} width={230} password icon='lock' onInputChange={(password2)=>this.setState({ password2 })}/>
          </fb>
          <fb className='inpRow'>
            <fb className='label'></fb>
            <fb className='soBtn saveBtn' onClick={this.submit}>{loading ? '...' : 'Speichern'}</fb>
          </fb>
        </fb>
      </fb>
    )
  }
}
