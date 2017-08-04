import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
//import { saveUserToDB, deleteUser } from 'actions'
import { numToTriplex, isValidEmail } from 'helpers'
import './styles.css';

class AddEditUserPopup extends Component {
	constructor(props) {
		super(props);

		const { user, users, branches } = this.props

		const pickRandomColor 	= () => 'orange' // TODO come back and fix this
		const getDefaultBranch 	= () => branches.length === 1 ? {[branches[0]]: true} : {}
		const getFreshUserID		= () => numToTriplex(users.length + 1)
		const getFreshUserObj 	= () => ({
			id: getFreshUserID(),
			name: '',
			email: '',
			color: pickRandomColor(),
			branches: getDefaultBranch(),
			position: {}
		})


		this.state = {
			user: user ? user : getFreshUserObj(),
			errorText: '',
		}
	}

	onButtonClicked = () => {
		const { name, email, branches, position} = this.state
		let errorText = ''

		if(name === '') 								errorText = 'Bitte geben Sie einen Benutzernamen ein.'
		if(!isValidEmail(email)) 				errorText = 'Bitte geben Sie eine gültige Email-Adresse an'
		if(!_.keys(branches).length)		errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!_.keys(position).length)		errorText = 'Bitte wählen Sie eine Gruppe aus.'

		if(errorText){
			this.setState({errorText})
		} else {
			this.props.saveUserToDB(this.state.user)
			this.props.close()
		}
	}

	onNameInputChanged(input) {
		this.setState({name: input.target.value})
	}

	render() {
		return (
			<SModal.Main title='Neuer Benutzer' onClose={this.props.onClose}>
				<SModal.Body>
					<fb className="addEditUserPopup">
						{ this.state.errorText ? <fb className="errorText">{this.state.errorText}</fb> : null}
						<fb className="inputItemWrapper">
							<fb className="inputDescription" >Benutzername:</fb>
							<input className="nameInputField" type="text" value={this.state.name} autoFocus onChange={this.onNameInputChanged.bind(this)}/>
						</fb>
							{	this.props.branches.length > 1 &&
								<fb className="inputItemWrapper">
									Display Branches selectField
								</fb>
							}
						<fb className="inputItemWrapper">
							Display Positions selectField
						</fb>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton
						right
						label={this.props.editing ? 'speichern' : 'Nurtzer Erstellen'}
						onClick={this.onButtonClicked}
						disabled={false} //TODO: come and finish this here.
						color={'#2ECC71'}
					/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

const mapStateToProps = (state) => ({
	users: state.core.users,
	positions: state.core.positions,
	branches: state.core.branches
})

export default connect(mapStateToProps)(AddEditUserPopup)
