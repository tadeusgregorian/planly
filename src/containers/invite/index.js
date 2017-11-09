//@flow

import React, { PureComponent } from 'react';
import firebase from 'firebase'

import type { User } from 'types/index'
import './styles.css'

type Props = {
  match: { params: { aID: string, uID: string } },
  history: { push: Function },
}

type State = {
  accID: string,
  pw1:  string,
  pw2:  string,
  error:  string,
  status:  string,
  email:  string,
  userID:  string,
  name: string,
}


export default class Invite extends PureComponent {
  state: State;

	constructor(props: Props) {
		super(props)

		this.state = {
      accID: props.match.params.aID,
      userID: props.match.params.uID,
      pw1: '',
      pw2: '',
      error: '',
      status: '',
      email: '',
      name: '',
    }
	}

  componentDidMount = () => {
    const { accID, userID } = this.state

    const baseUrl = 'https://plandy-91a56.firebaseapp.com' // TODO: come back here and check Environment to pick DEV/PROD url

    fetch(baseUrl + `/api/get-invite-status/${accID}/${userID}/`)
      .then(res => res.json())
      .then(json => {
        const user = JSON.parse(json)
        user && user.id && this.populateState(user)
      })
      .catch(err => console.log('error tade: ', err))
  }

  populateState = (u: User) => {
    const email = u.email || '' // flow issue ( At this point there is defos an email ) // as long as the admin didnt delete it meanwhile...
    this.setState({ email , status: u.status, name: u.name })
  }

  createUserEntry = (fbUser: {email: string, uid: string}): Promise<{}> => {
    const { email, uid } = fbUser
    const { userID, accID } = this.state
    return firebase.database().ref(`allUsers/${uid}`).set({ userID, email, account: accID })
  }

  saveClicked = () => {
    const { pw1, pw2, email, status, userID } = this.state
    if(!userID)                 return this.setError('Benutzerdaten noch nicht korrekt geladen' )
    if( pw1 !== pw2   )         return this.setError('Passwörter sind nicht identisch' )
    if( pw1 && pw1.length < 6 ) return this.setError('Passwort ist zu kurz' )
    if( status === 'ACTIVE')    return this.setError('Zugang ist bereits aktiveirt')

    // maybe instable: ( race condition possible )
    // createUserWith.. automatically signs user in after creation ->
    // we have registred an authStateChange listener -> handles LoggingIn
    // For that it checks the allUsers from the database -> to get the AccountID that the user is associated with.
    // -> this entry is being created here in the .then function -> still it somehow gets executed on the DB prior
    // to the query of the authStateChange-listener. So it works here just fine. Just kind of spooky. so watch out here...
    firebase.auth().createUserWithEmailAndPassword(email, pw1)
      .then(fbUser => this.createUserEntry(fbUser))
      .then(res    => this.props.history.push('/'))
      .catch(error => {
        if(error.code === 'auth/email-already-in-use') this.setError('Email-Adresse bereits in Nutzung')
      })
  }

  setError = (error: string) => this.setState({ error })

	render() {

    const { pw1, pw2, email, error, status, name } = this.state
    const isActive = status === 'ACTIVE'

    if(isActive) return (
      <fb className='inviteUserMain'>
        <fb className='container'>Zugang bereits Aktiviert</fb>
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
            <input className='pw' type='password' value={pw1}  onChange={(e)=>this.setState({ pw1: e.target.value })} placeholder='passwort' />
            <input className='pw' type='password' value={pw2}  onChange={(e)=>this.setState({ pw2: e.target.value })} placeholder='passwort wiederholen' />
            <fb className='saveBtn soBtn' onClick={this.saveClicked}>speichern</fb>
          </fb>
        </fb>
			</fb>
		)
	}
}
