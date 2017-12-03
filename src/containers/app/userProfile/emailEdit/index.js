//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import firebase from 'firebase'
import { updateUserEmail } from 'actions/users'

import Headline from '../components/headline'
import InputMinimal from 'components/inputMinimal'
import getCurrentUser from 'selectors/currentUser'
import { Toast } from 'helpers/iziToast'

import type { User } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User
}

type State = {
  email: string,
  password: string,
  loading: boolean,
  errorMsg: string,
}

class EmailEdit extends PureComponent {
  props: Props
  state: State

  constructor(props: Props){
    super(props)
    this.state = {
      email: '',
      password: '',
      loading: false,
      errorMsg: '',
    }
  }

  submit = () => {
    const { email , password } = this.state
    const { currentUser } = this.props

    this.setState({ loading: true, errorMsg: '' })
    const user = firebase.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email , password)
    user.reauthenticateWithCredential(credential)
      .then(() => user.updateEmail(email))
      .then(() => {
        updateUserEmail(currentUser.id, user.uid, email).then(() => Toast.success('Email wurde geändert'))
        this.setState({ email: '', password: '', loading: false })
      })
      .catch((e) => {
        this.setState({ password: '', loading: false, errorMsg : e.message })
      })
  }

  render(){
    const { email, password, loading, errorMsg } = this.state
    const { currentUser } = this.props

    return(
      <fb className="profileEmailEditMain">
        <Headline title='E-mail-Adresse ändern' />
        <fb className='content'>
          <fb className='errorBarWrapper'>
            { errorMsg && <fb className='errorBar'>{errorMsg}</fb> }
          </fb>
          <fb className='inpRow'>
            <fb className='label'>Aktuelle Email Adresse:</fb>
            <fb className='currentMail'>{currentUser.email}</fb>
          </fb>
          <fb className='inpRow'>
            <fb className='label'>Aktuelles Passwort:</fb>
            <InputMinimal value={password} width={230} password icon='lock' onInputChange={(password)=>this.setState({ password })}/>
          </fb>
          <fb className='inpRow'>
            <fb className='label'>Neue Email Adresse:</fb>
            <InputMinimal value={email} width={230} icon='email' onInputChange={(email)=>this.setState({ email })}/>
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

const mapStateToProps = (state: Store) => ({
  currentUser: getCurrentUser(state)
})

const connector: Connector<{}, Props> = connect(mapStateToProps)
export default connector(EmailEdit)
