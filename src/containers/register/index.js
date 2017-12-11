//@flow
import React, { PureComponent } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'actions/auth';
import { getCookieByName } from 'helpers/cookies'
import { bundeslandOptions } from 'constants/general'
import Dropdown from 'react-dropdown'
import { createAccount } from 'actions/register';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
//import { Toast } from 'helpers/iziToast'
import type { BundeslandCode } from 'types/index'
import './styles.css'

type Props = {

}

type State = {
		name: string,
		email: string,
		branch: string,
		bundesland: BundeslandCode | 'empty',
		pw: string,
		pw2: string,
		loading: boolean,
		errorMsg: string,
}


export default class Register extends PureComponent {
	state: State
	constructor(props:Props) {
		super(props)
		this.state = {
			name: '',
			email: '',
			branch: '',
			bundesland: 'empty',
			pw: '',
			pw2: '',
			loading: false,
			errorMsg: '',
		}

		console.log(document.cookie);
	}

	componentDidMount = () => {
		//createCookie('regdata', 'myNamoo/-/email@was.de', 'localhost:3000/', 1)
		const cookie = getCookieByName('regdata')
		if(!cookie.includes('/-/')) return
		const nameEntered = cookie ? cookie.split("/-/")[0] : ''
		const emailEntered = cookie ? cookie.split("/-/")[1] : ''

		this.setState({ name: nameEntered, email: emailEntered })
	}

	setError = (msg: string) => this.setState({ errorMsg: msg })

	getInputError = (): string => {
		const { name, email, branch, bundesland, pw, pw2 } = this.state

		if(!name)    	 							return 'Name fehlt'
		if(!email)     							return 'E-Mail-Adresse fehlt'
		if(!branch)    							return 'Firmennamen fehlt.'
		if(bundesland === 'empty')  return 'Bitte Bundesland auswählen.'
		if(!pw)    		 							return 'Bitte geben Sie ein Passwort ein.'
		if(pw !== pw2) 							return 'Eingegebene Passwörter sind nicht identisch.'
		return ''
	}

	tryToRegister = () => {
		if(this.getInputError()) return this.setState({ errorMsg: this.getInputError() })

		const { email, pw, name, branch, bundesland } = this.state
		const _bundesland: BundeslandCode = (bundesland: any) // just typecasting for flow
		const accData = { name, email, branch, bundesland: _bundesland }

		this.setState({loading: true, errorMsg: ''})
		createUserWithEmailAndPassword(email, pw)
			.then((res) => createAccount(res.uid, accData))
			.then(() 		=> signInWithEmailAndPassword(email, pw))
			.then(() 		=> window.location.href = '/' )
			.catch((e) 	=> this.setState({ loading: false, errorMsg: e.message }))
	}

	render() {
		const { pw, pw2, email, name, loading, bundesland, branch, errorMsg } = this.state
		const bundeslandOptionsExt = bundeslandOptions.concat({ code: 'empty', name: 'Bundesland' })
		const curBundesland = bundesland && bundeslandOptionsExt.find(b => b.code === bundesland)
		const bundeslandName = curBundesland && curBundesland.name

		return (
			<fb className='register-page-main'>
				<fb className='register-container-wrapper'>
					<fb className="register-container">
						<fb className="title">APLANO</fb>
						<fb className='infoText'>{ errorMsg && <fb className='errorBar' >{errorMsg}</fb> }</fb>
						<fb className='content'>
							<fb className='section'>
								<InputMinimal defaultText="Vorname Nachname" value={name} onInputChange={name => this.setState({ name })} icon='user' />
								<InputMinimal defaultText="Email" 					 value={email} onInputChange={email => this.setState({ email })} icon='email' />
								<fb className='devider' />
							</fb>
							<fb className='section'>
								<InputMinimal defaultText="Firmenname" value={branch} onInputChange={branch => this.setState({ branch })} autoFocus/>
								<fb className='dropdownWrapper'>
									<Dropdown
										value={{value: bundesland, label: bundeslandName}}
										options={bundeslandOptions.map(b => ({value: b.code , label: b.name }))}
										onChange={(opt) => this.setState({bundesland: opt.value })}
									/>
								</fb>
							</fb>
							<fb className='section'>
								<InputMinimal defaultText="Passwort" 							value={pw}  onInputChange={pw  => this.setState({ pw })}  icon='lock' password/>
								<InputMinimal defaultText="Passwort wiederholen" 	value={pw2} onInputChange={pw2 => this.setState({ pw2 })} icon='lock' onEnter={this.tryToRegister} password/>
							</fb>
							<SButton
								className='formSubmitBtn'
								label={loading ? '...' : 'Registrieren'}
								onClick={this.tryToRegister}
								color='#2ecc71'
							/>
						</fb>
						<fb className='disclaimer'></fb>
					</fb>
				</fb>
			</fb>
		)
	}
}
