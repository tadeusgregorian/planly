import React, { PureComponent } from 'react';
import { signInWithEmailAndPassword } from 'actions/auth';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'

import './styles.css'

export default class Login extends PureComponent {
	constructor() {
		super()
		this.state = { username: '', password: '', loading: false}
	}

	tryToLogin = () => {
		this.setState({loading: true})
		signInWithEmailAndPassword(this.state.username, this.state.password)
			.catch((e) => {
				this.setState({password: '', loading: false})
				//Toast.error('Email oder Passowort falsch')
			})
	}


	render() {
		const { password, username, loading } = this.state

		return (
			<fb className='login-outer-container'>
				<fb className="login-container">
					<fb className="title">PLANLY</fb>
					<InputMinimal defaultText="Email" 		value={username} onInputChange={val => this.setState({username: val})} icon='email' rounded email autoFocus />
					<InputMinimal defaultText="Passwort" 	value={password} onInputChange={val => this.setState({password: val})} icon='lock'  rounded onEnter={this.tryToLogin} password/>
					<SButton
						label={loading ? '...' : 'Einloggen'}
						onClick={this.tryToLogin}
						sStyle={{alignSelf: 'stretch', marginLeft: 2, marginRight: -2, marginTop: 8}}
						color='#2ecc71'
					/>
				</fb>
			</fb>
		)
	}
}
