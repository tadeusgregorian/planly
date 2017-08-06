import React, { Component } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import Select from 'react-select';
import EmailStatus from './emailStatus'
import WithTooltip from 'components/withTooltip'
import FlatFormRow from './flatFormRow'
import WeeklyHoursInput from './weeklyHoursInput'
import { saveUserToDB, sendEmailInvite } from 'actions'
import { numToTriplex, isValidEmail } from 'helpers'
import './styles.css';

class AddEditUserPopup extends Component {
	constructor(props) {
		super(props);

		const { user, users, branches } = this.props

		const pickRandomColor 	= () => 'orange' // TODO come back and fix this
		const getDefaultBranch 	= () => branches.length === 1 ? {[branches[0].id]: true} : {}
		const getFreshUserID		= () => numToTriplex(users.length + 1)
		const getFreshUserObj 	= () => ({
			id: getFreshUserID(),
			name: '',
			email: '',
			weeklyHours: {1: ''},
			color: pickRandomColor(),
			branches: getDefaultBranch(),
			position: 'u001',
			status: 'notInvited'
		})


		this.state = {
			user: user ? user : getFreshUserObj(),
			errorText: '',
		}
	}


	getPositionsFormatted = () =>
		this.props.positions.map(pos => ({ value: pos.id, label: pos.name, color: pos.color }))

	needToSendEmailInvite = () => {
		const { user } = this.state
		const emailPrev = this.props.user && this.props.user.email // props.user is undefined if a new user is being created ( and not edited )
		if(!user.email) return false
		if(emailPrev === user.email ) return false
		return true
	}

	onButtonClicked = () => {
		const { id, name, email, branches, position } = this.state.user
		const { accountID } = this.props
		let errorText = ''

		if(!_.keys(branches).length)			errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!position)											errorText = 'Bitte wählen Sie eine Position aus.'
		if(email && !isValidEmail(email)) errorText = 'Bitte geben Sie eine gültige Email-Adresse an'
		if(name === '') 									errorText = 'Bitte geben Sie einen Benutzernamen ein.'

		if(errorText){
			this.setState({errorText})
		} else {
			saveUserToDB({ ...this.state.user, status: this.needToSendEmailInvite() ? 'invited' : 'notInvited'})
			if(this.needToSendEmailInvite()) sendEmailInvite(id, name, email, accountID)
			this.props.closeModal()
		}
	}

	updateUser = (key, newValue) => {
		this.setState({user: { ...this.state.user, [key]: newValue }})
	}

	onNameInputChanged 		= (val) => this.updateUser('name', val)
	onEmailInputChanged 	= (val) => this.updateUser('email', val)
	onWeeklyHoursChanged 	= (val) => this.updateUser('weeklyHours', val)
	onPositionChanged 		= (val) => this.updateUser('position', val)

	render() {
		const { name, email, weeklyHours, position, status } = this.state.user
		const editMode = this.props.user

		return (
			<SModal.Main title='Neuer Benutzer' onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditUserPopup">
						{ this.state.errorText && <fb className="errorText">{this.state.errorText}</fb>}
						<FlatFormRow label='Name'>
								<FlatInput value={name} onInputChange={this.onNameInputChanged} defaultText='Max Mustermann'/>
						</FlatFormRow>
						<FlatFormRow label='Email'>
								{ status === 'active' ?
									<WithTooltip text='Aktivierte Email adressen können nur vom Mitarbeiter selbst geändert werden.'><fb className="emailFrozen">{email}</fb></WithTooltip> :
									<FlatInput value={email} onInputChange={this.onEmailInputChanged} defaultText='max@gmail.de'/>
								}
							<EmailStatus status={status} hide={!editMode}/>
						</FlatFormRow>
						<FlatFormRow label='Position'>
							<div className="selectWrapper ">
								<Select
									clearable={false}
									value={position}
									options={this.getPositionsFormatted()}
									optionRenderer={(opt) => (<strong style={{ color: opt.color }}>{opt.label}</strong>)}
									valueRenderer={(opt) => (<strong style={{ color: opt.color }}>{opt.label}</strong>)}
									onChange={this.onPositionChanged}
									searchable={false}
								/>
							</div>
						</FlatFormRow>
						<FlatFormRow label='Wochenstunden'>
							<WeeklyHoursInput weeklyHours={weeklyHours} onChange={this.onWeeklyHoursChanged} extendable={editMode}/>
						</FlatFormRow>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					{ this.needToSendEmailInvite() &&
						<fb className="footerInfoText">Dem Mitarbeiter wird eine Einladung per Mail zugesandt.</fb>
					}
					<SButton
						right
						label={this.needToSendEmailInvite() ? 'speichern & einladen' : 'speichern'}
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
	branches: state.core.branches,
	accountID: state.auth.accountID
})

export default connect(mapStateToProps)(AddEditUserPopup)
