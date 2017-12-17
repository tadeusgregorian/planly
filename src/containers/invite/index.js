//@flow

import React, { PureComponent } from 'react';
import firebase from 'firebase'
import { Toast } from 'helpers/iziToast'
import { getAppUrl } from 'configs/index'
import type { User } from 'types/index'
import './styles.css'

type Props = {
  match: any, //{ params: { aID: string, uID: string } },
  history: any // { push: Function },
}

type State = {
  inviteID: string,
  accID: string,
  pw1:  string,
  pw2:  string,
  error:  string,
  status:  string,
  email:  string,
  userID:  string,
  name: string,
  dataLoaded: boolean,
  registrating: boolean,
}


export default class Invite extends PureComponent {
  state: State;

	constructor(props: Props) {
		super(props)

		this.state = {
      inviteID: props.match.params.inviteID,
      accID: props.match.params.accID,
      userID: '',
      pw1: '',
      pw2: '',
      error: '',
      status: '',
      email: '',
      name: '',
      dataLoaded: false,
      registrating: false,
    }
	}

  componentDidMount = () => {
    const { inviteID } = this.state

    fetch(getAppUrl() + `/api/get-invited-user/${inviteID}/`)
      .then(res => res.json())
      .then(json => {
        const user = JSON.parse(json)
        user && user.id && this.populateState(user)
      })
      .catch(err => {
        console.log('error tade: ', err)
        Toast.error('Einladung nicht gültig.')
        this.setState({ dataLoaded: true })
      })
  }

  populateState = (u: User) => {
    const email = u.email || '' // flow issue ( At this point there is defos an email ) // as long as the admin didnt delete it meanwhile...
    this.setState({ email , status: u.status, name: u.name, userID: u.id, dataLoaded: true })
  }

  createUserEntry = (firebaseUid: string): Promise<{}> => {
    const { userID, accID } = this.state
    return fetch(getAppUrl() + `/api/activate-user/${accID}/${userID}/${firebaseUid}`)
  }

  saveClicked = () => {
    const { pw1, pw2, email, status, userID } = this.state
    if(!userID)                 return this.setError('Benutzerdaten noch nicht korrekt geladen' )
    if( pw1 !== pw2   )         return this.setError('Passwörter sind nicht identisch' )
    if( pw1 && pw1.length < 6 ) return this.setError('Passwort ist zu kurz' )
    if( status === 'ACTIVE')    return this.setError('Zugang ist bereits aktiveirt')

    this.setState({ registrating: true })
    //fetch(getAppUrl() + `/api/activate-user/${accID}/${userID}/${firebaseUid}`)

    firebase.auth().createUserWithEmailAndPassword(email, pw1) // trys to signIn after registration -> but gets logged out again -> cause user isnt in allUsers jet
      .then(fbUser => this.createUserEntry(fbUser.uid))
      .then(res    => { window.location.replace("/login/fresh-user") })
      .catch(error => {
        this.setState({ registrating: false })
        if(error.code === 'auth/email-already-in-use') this.setError('Email-Adresse bereits in Nutzung')
      })
  }

  setError = (error: string) => this.setState({ error })

	render() {

    const { pw1, pw2, email, error, status, name, dataLoaded, registrating } = this.state

    if(status === 'ACTIVE') return (
      <fb className='inviteUserMain'>
        <fb className='container'>
          <fb className='text'>Zugang bereits Aktiviert</fb>
        <fb className='soBtn toTheLoginBtn' onClick={() => this.props.history.push('/login/fresh-user')}>Zum Login</fb>
        </fb>
      </fb>
    )

    if(status === 'NOT_INVITED') return ( // this should not happen here at all... -> means someone has changed the url parameter ( uid ) manually
      <fb className='inviteUserMain'>
        <fb className='container'>Du wurdest noch nicht eingeladen</fb>
      </fb>
    )

    if(name && !email) return (
      <fb className='inviteUserMain'>
        <fb className='container'>Email nicht mehr vorhanden - Neue einladung Erforderlich. </fb>
      </fb>
    )

    if(!dataLoaded) return (
      <fb className='inviteUserMain'>
        <fb className='container'>
          loading...
        </fb>
      </fb>
    )

		return (
			<fb className='inviteUserMain'>
        <fb className='container'>
          { error && <fb className='errorMsg'>{error}</fb> }
          <fb className="title">{`Hallo, ${name}`}</fb>
          <fb className='content'>
            <fb className='description text'>Passwort anlegen für</fb>
            <fb className='text email'>{email}</fb>
            <input
              className='pw'
              type='password'
              value={pw1}
              onChange={(e)=>this.setState({ pw1: e.target.value })}
              placeholder='passwort'
            />
            <input
              className='pw'
              type='password'
              value={pw2}
              onChange={(e)=>this.setState({ pw2: e.target.value })}
              placeholder='passwort wiederholen'
              onKeyDown={(e)=> { if(e.key === 'Enter') this.saveClicked() }}
            />
            <fb
              className='saveBtn soBtn'
              onClick={this.saveClicked}>
              { registrating ? '...' : 'speichern'}
            </fb>
          </fb>
        </fb>
			</fb>
		)
	}
}
