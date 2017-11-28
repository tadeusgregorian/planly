//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import omit from 'lodash/omit'
import { Toast } from 'helpers/iziToast'
import { saveUserToDB, addInvitationJob } from 'actions/users'
import EmailStatus 			from './emailStatus'

import SModal 					from 'components/sModal'
import SButton 					from 'components/sButton'
import FlatInput 				from 'components/flatInput'
import FlatFormRow 			from 'components/flatFormRow'
import WorkDaysPicker 	from 'components/workDaysPicker'

import ErrorMessageBar  	from './errorMessageBar'
import PositionSelect  		from './positionSelect'
import BranchSelect 			from './branchSelect'

import { getNextID, isValidEmail, isIntStr, isFloatStr, inpToInt, replaceDotsWithCommas } from 'helpers/index'
import { floatToMins, minsToFloat, getAvgDailyMins, minsToDetailedTime } from './localHelpers'
import type { WorkDays, UserStatus, Store } from 'types/index'
import './styles.css'

class AddEditUserPopup extends PureComponent {
	state: {
		id: 							string,
		name: 						string,
		email: 						string,
		branches: 				{},
		position: 				string,
		status: 					UserStatus,
		workDays: 				WorkDays,
		weeklyHours: 			string,
		vacDays: 					string,
		errorText: 				string,
	}

	constructor(props) {
		super(props);

		const { users, branches, user } = this.props

		const getDefaultBranch 	= () => branches.length === 1 ? {[branches[0].id]: true} : {}
		const getFreshUserID		= () => getNextID('u', users.length + 1)

		this.state = {
			id: 							user ? user.id 					: getFreshUserID(),
			name: 						user ? user.name 				: '',
			email: 						user ? user.email 			: '',
			branches: 				user ? user.branches 		: getDefaultBranch(),
			position: 				user ? user.position 		: 'p001',
			status: 					user ? user.status 			: 'NOT_INVITED',
			workDays: 				user ? user.workDays 		: { mo: 1, tu: 1, we: 1, th: 1, fr: 1, sa: 1 },
			vacDays:   				user ? user.vacDays			: '',
			weeklyHours: 			user ? minsToFloat(user.weeklyMins) 		: '', // gets stripped away before saving to DB
			errorText: 				'', 																					 // gets stripped away before saving to DB
		}
	}

	onSaveClicked = (invite: boolean) => {
		const { name, email, branches, position } = this.state
		let errorText = ''

		if(!Object.keys(branches).length)	 errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!position)											 errorText = 'Bitte wählen Sie eine Position aus.'
		if(!isValidEmail(email))  				 errorText = 'Bitte geben Sie eine gültige Email-Adresse an'
		if(name === '') 									 errorText = 'Bitte geben Sie einen Benutzernamen ein.'

		if(errorText){
			this.setState({errorText})
		} else {
			this.saveUser(invite)
			this.props.closeModal()
		}
	}

	saveUser = (sendInvite: boolean) => {
		const { weeklyHours, vacDays, workDays } = this.state
		let dbUser  = {
			...this.props.user,   // props like 'isAdmin' are not in state, thats why doing ...user ( from props )
			...omit(this.state, ['errorText', 'avgHours', 'avgMins', 'weeklyHours']),
			avgDailyMins: getAvgDailyMins(workDays, weeklyHours),
			vacDays:			vacDays ? inpToInt(vacDays) : null,
			weeklyMins: 	floatToMins(weeklyHours)
		}

		sendInvite && this.sendInvitation()
		saveUserToDB(dbUser)
	}

	sendInvitation = () => {
		const { name, id, email } = this.state
		const { accountID } = this.props

		this.setState({ status: 'INVITED' })
		Toast.success('Einladung gesendet an ' + email )
		addInvitationJob({ name, userID: id, email, accountID })
	}

	updateUser = (key, newValue) => this.setState({[key]: newValue })

	initialOvertimeChanged 		= (val) => this.updateUser('initialOvertime', val)
	nameInputChanged 					= (val) => this.updateUser('name', val)
	positionChanged 					= (val) => this.updateUser('position', val.value)
	branchesChanged 					= (val) => this.updateUser('branches', val.reduce((acc, val) => ({ ...acc, [val.value]: true }) , {}))

	emailInputChanged = (email) => {
		this.setState({ email })
		if( this.props.user ){
			const emailChanged = email !== this.props.user.email
			this.setState({ status: emailChanged ? 'NOT_INVITED' : this.props.user.status })
		}
	}

	weeklyHoursChanged 	= (weeklyHours) => isFloatStr(weeklyHours) 	&& this.setState({ weeklyHours })
	onVacDaysChanged 		= (vacDays) 		=> isIntStr(vacDays) 	 			&& this.setState({ vacDays })
	avgDailyMinsChanged = (target, inp) => isIntStr(inp) 		   			&& this.setState({[target]: inp})
	workDaysChanged 		= (workDays) 		=> this.setState({ workDays })

	render() {
		const { name, email, weeklyHours, position, branches, status, workDays, vacDays } = this.state
		const allBranches 	= this.props.branches
		const allPositions 	= this.props.positions
		const editMode 			= !!this.props.user
		const avgHours 			= Math.round(getAvgDailyMins(workDays, weeklyHours) / 60 * 100) / 100
		const avgHoursStr 	= replaceDotsWithCommas(avgHours) + ' Stunden'
		const validEmail    = isValidEmail(email)

		const avgTimeStr    = minsToDetailedTime(getAvgDailyMins(workDays, weeklyHours))
		const avgTimeTTip   = 'Durchschnittliche tägliche Arbeitszeit: ' + avgTimeStr


		return (
			<SModal.Main title={ editMode ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter' } onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditUserPopup">
						<fb className='mainForm'>
							<ErrorMessageBar errorText={this.state.errorText} />
							<FlatFormRow label='Name'>
								<FlatInput value={name} onInputChange={this.nameInputChanged} defaultText='Max Mustermann'/>
							</FlatFormRow>
							<FlatFormRow label='Email'>
								<FlatInput value={email} onInputChange={this.emailInputChanged} defaultText='max@gmail.de' disabled={status === 'ACTIVE'}/>
								<EmailStatus status={status} hide={!editMode} sendInvitation={this.sendInvitation} validEmail={validEmail} />
							</FlatFormRow>
							<FlatFormRow label='Position'>
								<PositionSelect positions={allPositions} selected={position} onChange={this.positionChanged} />
							</FlatFormRow>
							{	allBranches.length > 1 &&
								<FlatFormRow label='Filialen'>
									<BranchSelect branches={allBranches} selected={branches} onChange={this.branchesChanged} />
								</FlatFormRow>
							}
							<FlatFormRow label='Wochenstunden'>
								<FlatInput value={weeklyHours} onInputChange={this.weeklyHoursChanged} defaultText='0'/>
							</FlatFormRow>
							<FlatFormRow label='Urlaubstage'>
								<FlatInput value={vacDays} onInputChange={this.onVacDaysChanged} defaultText='0'/>
							</FlatFormRow>
							<FlatFormRow label='Arbeitstage'>
								<WorkDaysPicker workDays={workDays} onChange={this.workDaysChanged} />
								{ !!avgHours && <fb className='avgDailyHours'  data-balloon={avgTimeTTip} >&Oslash; {avgHoursStr}</fb> }
							</FlatFormRow>
						</fb>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton right label='speichern' onClick={()=>this.onSaveClicked(false)} color={ (editMode || !validEmail) && '#2ECC71' } />
					{ !editMode && <SButton label='speichern & einladen' onClick={()=>this.onSaveClicked(true)} color='#2ECC71' disabled={ !validEmail } /> }
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

const mapStateToProps = (state: Store) => ({
	users: state.core.users,
	positions: state.core.positions,
	branches: state.core.branches,
	accountID: state.auth.accountID
})

export default connect(mapStateToProps)(AddEditUserPopup)
