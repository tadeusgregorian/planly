//@flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { signInWithEmailAndPassword, checkIfEmailExists, sendPasswordResetEmail } from 'actions/auth';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import PasswordForgotten from './passwordForgotten'
import { Toast } from 'helpers/iziToast'
import type { Store, AuthState } from 'types/index'
import './styles.css'

type State = {
	password: string,
	username: string,
	passwordForgotten: boolean,
	loading: boolean,
}

type Props = {
	authState: AuthState,
	authenticate: Function,
	authFailed: Function
}

class Login extends PureComponent {
	state: State

	constructor() {
		super()
		this.state = {
			username: '',
			password: '',
			passwordForgotten: false,
			loading: false,
		}
	}

	componentDidMount = () => {
		if(window.location.href.includes('fresh-user')) {
			Toast.success('Registrierung Erfolgreich. Du kannst dich jetzt einloggen.')
		}
	}

	tryToLogin = () => {
		if(this.props.loading) return
		if(this.props.dbVersion === 'maintenance') return Toast.warning('Offline wegen Serverupdates. In Kürze wieder online.')
		this.setState({ loading: true })
		this.props.authenticate()
		signInWithEmailAndPassword(this.state.username, this.state.password)
			.catch((e) => {
				this.setState({ password: '', loading: false })
				this.props.authFailed()
				if(e.code ===  "auth/user-not-found") Toast.error('Email nicht registriert')
				if(e.code ===  "auth/wrong-password") Toast.error('Passwort inkorrekt')
			})
	}

requestPWLink = async (email: string) => {
		const emailExists = await checkIfEmailExists(email) // @TODO: the function is empty
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
						zur Homepages
					</fb>
					<fb className='loginBox'>
						<fb className="title">APLANO</fb>
						<InputMinimal defaultText="Email" 		value={username} onInputChange={val => this.setState({username: val})} icon='email' iStyle={{fontSize: 16}} rounded autoFocus email/>
						<InputMinimal defaultText="Passwort" 	value={password} onInputChange={val => this.setState({password: val})} icon='lock'  iStyle={{fontSize: 16}} rounded onEnter={this.tryToLogin} password/>
						<SButton
							label={loading ? '...' : 'Einloggen' }
							onClick={this.tryToLogin}
							sStyle={{alignSelf: 'stretch', margin: '8px 2px 0px 2px' }}
							color='#2ecc71'
						/>
						<fb className="passwordForgottenBtn" onClick={() => this.setState({passwordForgotten: true})}>Passwort vergessen?</fb>
					</fb>
				</fb>
			</fb>
		)
	}
}

const actionCreators = {
	authenticate: () => ({ type: 'USER_IS_AUTHENTICATING' }),
	authFailed: () => ({ type: 'AUTH_FAILED' })
}

const mapStateToProps = (state: Store) => ({
	authState: state.auth.authState,
	dbVersion: state.dbVersion
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(Login)
