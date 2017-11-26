//@flow
import React, { PureComponent } from 'react';
import { signInWithEmailAndPassword, checkIfEmailExists, sendPasswordResetEmail } from 'actions/auth';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import PasswordForgotten from './passwordForgotten'
import { Toast } from 'helpers/iziToast'
import './styles.css'

type State = {
	password: string,
	username: string,
	passwordForgotten: boolean,
	loading: boolean,
}


export default class Login extends PureComponent {
	state: State

	constructor() {
		super()
		this.state = {
			username: '',
			password: '',
			passwordForgotten: false,
			loading: false
		}
	}

	componentDidMount = () => {
		if(window.location.href.includes('fresh-user')) {
			Toast.success('Registrierung Erfolgreich. Du kannst dich jetzt einloggen.')
		}
	}

	tryToLogin = () => {
		this.setState({loading: true})
		signInWithEmailAndPassword(this.state.username, this.state.password)
			.catch((e) => {
				this.setState({password: '', loading: false})
				Toast.error('Email oder Passowort falsch')
			})
	}

requestPWLink = async (email: string) => {
		//Toast.info('...')
		const emailExists = await checkIfEmailExists(email)
		if(emailExists){
			sendPasswordResetEmail(email)
			Toast.info('E-Mail gesendet. Überprüfen Sie Ihr Postfach.')
			this.setState({passwordForgotten: false})
		}else{
			Toast.error('Diese E-Mail Adresse ist nicht registriert')
		}
	}

	render() {
		const { password, username, passwordForgotten, loading } = this.state
		if(passwordForgotten) return <PasswordForgotten requestPWLink={this.requestPWLink}/>

		return (
			<fb className='loginMain'>
				<fb className="loginWrapper">
					<fb className='toHomepage' onClick={()=> window.location.href = "https://www.aplano.de" }>
						<fb className='icon icon-navigate_before' />
						zur Homepage
					</fb>
					<fb className='loginBox'>
						<fb className="title">APLANO</fb>
						<InputMinimal defaultText="Email" 		value={username} onInputChange={val => this.setState({username: val})} icon='email' iStyle={{fontSize: 16}} rounded autoFocus email/>
						<InputMinimal defaultText="Passwort" 	value={password} onInputChange={val => this.setState({password: val})} icon='lock'  iStyle={{fontSize: 16}} rounded onEnter={this.tryToLogin} password/>
						<SButton
							label={loading ? '...' : 'Einloggen'}
							onClick={this.tryToLogin}
							sStyle={{alignSelf: 'stretch', marginLeft: 2, marginRight: -2, marginTop: 8}}
							color='#2ecc71'
						/>
						<fb className="passwordForgottenBtn" onClick={() => this.setState({passwordForgotten: true})}>Passwort vergessen?</fb>
					</fb>
				</fb>
			</fb>
		)
	}
}
