import React, { PureComponent } from 'react';
import { signInWithEmailAndPassword, checkIfEmailExists, sendPasswordResetEmail } from 'actions/auth';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import PasswordForgotten from './passwordForgotten'
import { Toast } from 'helpers'
import './styles.css'


export default class Login extends PureComponent {
	constructor() {
		super()
		this.state = { username: '', password: '', passwordForgotten: false, loading: false}
		this.requestPWLink = this.requestPWLink.bind(this)
	}

	tryToLogin = () => {
		this.setState({loading: true})
		signInWithEmailAndPassword(this.state.username, this.state.password)
			.catch((e) => {
				this.setState({password: '', loading: false})
				Toast.error('Email oder Passowort falsch')
			})
	}

	async requestPWLink (email) {
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
			<fb className='login-outer-container'>
				<fb className="login-container">
					<fb className="title">APOTOWER</fb>
					<InputMinimal defaultText="Email" 		value={username} onInputChange={val => this.setState({username: val})} icon='email' autoFocus />
					<InputMinimal defaultText="Passwort" 	value={password} onInputChange={val => this.setState({password: val})} icon='lock' onEnter={this.tryToLogin} password/>
					<SButton
						label={loading ? '...' : 'Einloggen'}
						onClick={this.tryToLogin}
						sStyle={{alignSelf: 'stretch', marginLeft: 2, marginRight: -2, marginTop: 8}}
						color='#2ecc71'
					/>
					<fb className="passwordForgottenBtn" onClick={() => this.setState({passwordForgotten: true})}>Passwort vergessen?</fb>
				</fb>
			</fb>
		)
	}
}
