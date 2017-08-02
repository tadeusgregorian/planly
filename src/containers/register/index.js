import React, { PureComponent } from 'react';
import { createUserWithEmailAndPassword } from 'actions/auth';
import { createAccount } from 'actions/register';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import { Toast } from 'helpers'
import './styles.css'


export default class Register extends PureComponent {
	constructor() {
		super()
		this.state = {
			email: '',
			password: '',
			loading: false
		}
	}

	tryToRegister = () => {
		this.setState({loading: true})
		createUserWithEmailAndPassword(this.state.email, this.state.password)
			.catch((e) => {
				this.setState({password: '', loading: false})
				Toast.error(e.message)
			})
			.then((res) => {
				createAccount(res.uid, res.email)
			})
	}

	render() {
		const { password, email, loading } = this.state

		return (
			<fb className='login-outer-container'>
				<fb className="login-container">
					<fb className="title">REGISTRIEREN</fb>
					<InputMinimal defaultText="Email" 		value={email} onInputChange={val => this.setState({email: val})} icon='email' autoFocus />
					<InputMinimal defaultText="Passwort" 	value={password} onInputChange={val => this.setState({password: val})} icon='lock' onEnter={this.tryToRegister} password/>
					<SButton
						label={loading ? '...' : 'Registrieren'}
						onClick={this.tryToRegister}
						sStyle={{alignSelf: 'stretch', marginLeft: 2, marginRight: -2, marginTop: 8}}
						color='#2ecc71'
					/>
				</fb>
			</fb>
		)
	}
}
