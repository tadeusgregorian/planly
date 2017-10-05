//@flow

import React, { PureComponent } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import Select from 'react-select';
import EmailStatus from './emailStatus'
import WithTooltip from 'components/withTooltip'
import FlatFormRow from 'components/flatFormRow'
import WeeklyHoursInput from './weeklyHoursInput'
import ExtendedUserConfigs from './extendedUserConfigs'
import type { User } from 'types/index'
import { saveUserToDB, sendEmailInvite } from 'actions/index'
import { getNextID, isValidEmail, replaceCommasWithDots, getThisMondaySmart, momToSmartWeek } from 'helpers/index'
import './styles.css'

class AddEditUserPopup extends PureComponent {
	state: User & { errorText: string }

	constructor(props) {
		super(props);

		const { users, branches } = this.props

		const pickRandomColor 	= () => 'orange' // TODO come back and fix this
		const getDefaultBranch 	= () => branches.length === 1 ? {[branches[0].id]: true} : {}
		const getFreshUserID		= () => getNextID('u', users.length + 1)

		this.state = {
			id: 							getFreshUserID(),
			name: 						'',
			email: 						'',
			weeklyHours: 			{[getThisMondaySmart()]: ''},
			color: 						pickRandomColor(),
			branches: 				getDefaultBranch(),
			position: 				'p001',
			status: 					'notInvited',
			initialOvertime: 	{smartWeek: momToSmartWeek(moment().subtract(7, 'days')), hours: 0 },
			errorText: 				'',
		}
	}

	weeklyHoursValid = () => {
		return _.values(this.state.weeklyHours).reduce(
			(acc, val) => acc && !isNaN(parseFloat(replaceCommasWithDots(val))) , true
		)
	}

	getPositionsFormatted = () =>
		this.props.positions.map(pos => ({ value: pos.id, label: pos.name, color: pos.color }))

	needToSendEmailInvite = () => {
		const user = this.state
		const emailPrev = this.props.user && this.props.user.email // props.user is undefined if a new user is being created ( and not edited )
		if(!user.email) return false
		if(emailPrev === user.email ) return false
		return true
	}

	onButtonClicked = () => {
		const { id, name, email, branches, position } = this.state
		const { accountID } = this.props
		let errorText = ''

		if(!this.weeklyHoursValid())			errorText = 'Bitte geben Sie die Wochenstunden an.'
		if(!_.keys(branches).length)			errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!position)											errorText = 'Bitte wählen Sie eine Position aus.'
		if(email && !isValidEmail(email)) errorText = 'Bitte geben Sie eine gültige Email-Adresse an'
		if(name === '') 									errorText = 'Bitte geben Sie einen Benutzernamen ein.'

		if(errorText){
			this.setState({errorText})
		} else {
			const cleanedUser  = _.omit(this.state, 'errorText')
			cleanedUser.status = this.needToSendEmailInvite() ? 'invited' : cleanedUser.status
			saveUserToDB(cleanedUser)
			if(this.needToSendEmailInvite()) sendEmailInvite(id, name, email, accountID)
			this.props.closeModal()
		}
	}

	updateUser = (key, newValue) => this.setState({[key]: newValue })

	onInitialOvertimeChanged 		= (val) => this.updateUser('initialOvertime', val)
	onNameInputChanged 					= (val) => this.updateUser('name', val)
	onEmailInputChanged 				= (val) => this.updateUser('email', val)
	onWeeklyHoursChanged 				= (val) => this.updateUser('weeklyHours', val)
	onPositionChanged 					= (val) => this.updateUser('position', val.value)
	onBranchesChanged 					= (val) => this.updateUser('branches', val.reduce((acc, val) => ({ ...acc, [val.value]: true }) , {}))

	render() {
		const { name, email, weeklyHours, position, branches, status, initialOvertime } = this.state
		const editMode = this.props.user

		return (
			<SModal.Main title={ editMode ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter' } onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditUserPopup">
						<fb className='mainForm'>
							{ this.state.errorText &&
									<fb className="errorText">
										<fb className='icon icon-error_outline' />
										<fb className='text'>{this.state.errorText}</fb>
									</fb>
							}
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
								<div className="selectWrapper">
									<Select
										clearable={false}
										value={position}
										options={this.getPositionsFormatted()}
										optionRenderer={(opt) => (<fb style={{ color: opt.color }}>{opt.label}</fb>)}
										valueRenderer={(opt) => (<fb style={{ }}>{opt.label}</fb>)}
										onChange={this.onPositionChanged}
										searchable={false}
									/>
								</div>
							</FlatFormRow>
							{
								<FlatFormRow label='Filialen'>
									<div className="selectWrapper branchesSelectWrapper">
										<Select multi
											clearable={false}
											value={_.keys(branches)}
											options={this.props.branches.map(b => ({value: b.id, label: b.name}))}
											onChange={(newVal) => this.onBranchesChanged(newVal)}
											searchable={false}
											placeholder='Filiale wählen'
										/>
									</div>
								</FlatFormRow>
							}
							<FlatFormRow label='Wochenstunden'>
								<WeeklyHoursInput weeklyHours={weeklyHours} setWeeklyHours={(this.onWeeklyHoursChanged)} extendable={editMode}/>
							</FlatFormRow>
						</fb>
						<ExtendedUserConfigs
							initialOvertime={initialOvertime}
							changeInitialOvertime={this.onInitialOvertimeChanged}
						/>
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
