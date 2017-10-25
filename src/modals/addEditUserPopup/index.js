//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { saveUserToDB } from 'actions/users'
import EmailStatus 			from './emailStatus'

import SModal 					from 'components/sModal'
import Expander 				from 'components/expander'
import SButton 					from 'components/sButton'
import FlatInput 				from 'components/flatInput'
//import WithTooltip 			from 'components/withTooltip'
import FlatFormRow 			from 'components/flatFormRow'
import WorkDaysPicker 	from 'components/workDaysPicker'

import AvgDailyMinsRow  from './avgDailyMinsRow'
import ErrorMessageBar  from './errorMessageBar'
import PositionSelect  	from './positionSelect'
import BranchSelect 		from './branchSelect'

import { getNextID, isValidEmail, isIntStr } from 'helpers/index'
import { inpToInt, extractHours, extractMins, floatToMins, minsToFloat, getAvgs } from './localHelpers'
import type { WorkDays, UserStatus } from 'types/index'
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
		avgHours:					number,
		avgMins:					number,
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
			weeklyHours: 			user ? minsToFloat(user.weeklyMins) 		: '0', // gets stripped away before saving to DB
			avgHours:					user ? extractHours(user.avgDailyMins)  : 0,   // gets stripped away before saving to DB
			avgMins:					user ? extractMins(user.avgDailyMins) 	: 0,   // gets stripped away before saving to DB
			errorText: 				'', 																					 // gets stripped away before saving to DB
		}
	}

	onSaveClicked = (invite: boolean) => {
		const { name, email, branches, position } = this.state
		let errorText = ''

		if(!_.keys(branches).length)			 errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!position)											 errorText = 'Bitte wählen Sie eine Position aus.'
		if(email && !isValidEmail(email))  errorText = 'Bitte geben Sie eine gültige Email-Adresse an'
		if(name === '') 									 errorText = 'Bitte geben Sie einen Benutzernamen ein.'

		if(errorText){
			this.setState({errorText})
		} else {
			this.saveUser(invite)
			this.props.closeModal()
		}
	}

	saveUser = (sendInvite: boolean) => {
		const { avgHours , avgMins, weeklyHours, status } = this.state
		let dbUser  = {
			...this.props.user,   // props like 'isAdmin' are not in state, thats why doing ...user ( from props )
			..._.omit(this.state, ['errorText', 'avgHours', 'avgMins', 'weeklyHours']),
			avgDailyMins: avgMins + (avgHours * 60 || 0),
			weeklyMins: 	floatToMins(weeklyHours),
			status: 			sendInvite ? 'INVITED' : status
		}

		saveUserToDB(dbUser)
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

	weeklyHoursChanged = (weeklyHours) => {
		this.setState({ weeklyHours, ...getAvgs(this.state.workDays, weeklyHours)})
	}

	avgDailyMinsChanged = (target, inp) => isIntStr(inp) && this.setState({[target]: inpToInt(inp)})

	workDaysChanged = (workDays) => {
		this.setState({ workDays, ...getAvgs(workDays, this.state.weeklyHours) })
	}

	render() {
		const { name, email, weeklyHours, position, branches, status, workDays, avgHours, avgMins } = this.state
		const allBranches = this.props.branches
		const allPositions = this.props.positions
		const emailDisabled = status === 'ACTIVE'
		const notInvited = status === 'NOT_INVITED'
		const editMode = !!this.props.user

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
								<FlatInput value={email} onInputChange={this.emailInputChanged} defaultText='max@gmail.de' disabled={emailDisabled}/>
								<EmailStatus status={status} hide={!editMode}/>
							</FlatFormRow>
							<FlatFormRow label='Position'>
								<PositionSelect positions={allPositions} selected={position} onChange={this.positionChanged} />
							</FlatFormRow>
							<FlatFormRow label='Filialen'>
								<BranchSelect branches={allBranches} selected={branches} onChange={this.branchesChanged} />
							</FlatFormRow>
							<FlatFormRow label='Wochenstunden'>
								<FlatInput value={weeklyHours} onInputChange={this.weeklyHoursChanged} defaultText='z.B. 40'/>
							</FlatFormRow>
						</fb>
						<Expander label='Abwesenheit'>
							<WorkDaysPicker workDays={workDays} onChange={this.workDaysChanged} />
							<AvgDailyMinsRow avgHours={avgHours} avgMins={avgMins} onChange={this.avgDailyMinsChanged} />
						</Expander>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton right label='speichern' onClick={()=>this.onSaveClicked(false)} color={!notInvited && '#2ECC71' } />
					<SButton label='speichern & einladen' onClick={()=>this.onSaveClicked(true)} disabled={status === 'ACTIVE'} color={notInvited && '#2ECC71'} />
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
