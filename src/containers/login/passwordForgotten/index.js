import React, { PureComponent } from 'react';
import InputMinimal from 'components/inputMinimal'
import SButton from 'components/sButton'
import { Toast, isValidEmail } from 'helpers'
import './styles.css'


export default class PasswordForgotten extends PureComponent {
	constructor() {
		super()
		this.state = { email: '' }
	}



	onClick = () => {
		const { email } = this.state
		const validEmail = isValidEmail(email)
		validEmail ? this.props.requestPWLink(email) : Toast.error('Bitte gültige Email-Adresse eingeben.')
	}

	getExplenationText = () => (
		<fb className="content">
			<span>Geben Sie die E-Mail Adresse ein, mit der Sie sich registriert haben. Sie erhalten eine E-Mail, um ein neues Passwort zu erstellen.</span>
		</fb>
	)


	render() {
		const { email } = this.state

		return (
			<fb className='pwForgotten-outer-container'>
				<fb className="pwForgotten-container">
					<fb className="title">APOTOWER</fb>
					<fb className="infoText">{this.getExplenationText()}</fb>
					<InputMinimal defaultText="Email" value={email} onInputChange={val => this.setState({email: val})} icon='email' onEnter={this.onClick} autoFocus/>
					<SButton label="Link Anfordern" onClick={this.onClick} sStyle={{width: '100%', marginLeft: 2, marginRight: -2, marginTop: 8}} color='#2ecc71'/>
				</fb>
			</fb>
		)
	}
}
