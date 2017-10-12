//@flow
import React, { PureComponent } from 'react'
import _ from 'lodash'
import moment from 'moment'
import Select from 'react-select';
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import Expander from 'components/expander'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import EmailStatus from './emailStatus'
import WithTooltip from 'components/withTooltip'
import FlatFormRow from 'components/flatFormRow'
import WeeklyHoursInput from './weeklyHoursInput'
import WorkDaysPicker from 'components/workDaysPicker'
import InitialOvertime from './initialOvertime'
import type { User } from 'types/index'
import { saveUserToDB, sendEmailInvite } from 'actions/index'
import { sumWorkHours, getAverageHours } from './localHelpers'
import { getNextID, isValidEmail, replaceCommasWithDots, getThisSmartWeek, momToSmartWeek } from 'helpers/index'
import './styles.css'

class AddEditUserPopup extends PureComponent {
	state: User & { errorText: string }

	constructor(props) {
		super(props);

		const { users, branches, user } = this.props

		const pickRandomColor 	= () => 'orange' // TODO come back and fix this
		const getDefaultBranch 	= () => branches.length === 1 ? {[branches[0].id]: true} : {}
		const getFreshUserID		= () => getNextID('u', users.length + 1)

		this.state = {
			id: 							user ? user.id 					: getFreshUserID(),
			name: 						user ? user.name 				: '',
			email: 						user ? user.email 			: '',
			weeklyHours: 			user ? user.weeklyHours : {[getThisSmartWeek()]: 0},
			color: 						user ? user.color 			: pickRandomColor(),
			branches: 				user ? user.branches 		: getDefaultBranch(),
			position: 				user ? user.position 		: 'p001',
			status: 					user ? user.status 			: 'notInvited',
			workDays: 				user ? user.workDays 		: { mo: 0, tu: 0, we: 0, th: 0, fr: 0, sa: 0, su: 0 },
			initialOvertime: 	user ? user.initialOvertime : {smartWeek: momToSmartWeek(moment()), hours: 0 },
			errorText: 				'',
		}
	}

	validFloat = (num) => (!isNaN(parseFloat(replaceCommasWithDots(num.toString()))))

	weeklyHoursValid = () => {
		return _.values(this.state.weeklyHours).reduce(
			(acc, val) => acc && this.validFloat(val) , true
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
		const { id, name, email, branches, position, initialOvertime } = this.state
		const initialHours = initialOvertime.hours
		const { accountID, user } = this.props
		let errorText = ''

		if(!this.weeklyHoursValid())  		 errorText = 'Bitte geben Sie die Wochenstunden an.'
		if(!_.keys(branches).length)			 errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!position)											 errorText = 'Bitte wählen Sie eine Position aus.'
		if(email && !isValidEmail(email))  errorText = 'Bitte geben Sie eine gültige Email-Adresse an'
		if(name === '') 									 errorText = 'Bitte geben Sie einen Benutzernamen ein.'
		if(!this.validFloat(initialHours)) errorText = 'Überstunden Übertrag nicht zulässig'

		if(errorText){
			this.setState({errorText})
		} else {
			const cleanedUser  = {  ...user,  ..._.omit(this.state, 'errorText')} // props like 'isAdmin' are not in state, thats why doing ...user ( from props )
			cleanedUser.status = this.needToSendEmailInvite() ? 'invited' : cleanedUser.status
			saveUserToDB(cleanedUser)
			if(this.needToSendEmailInvite()) sendEmailInvite(id, name, email, accountID)
			this.props.closeModal()
		}
	}

	updateUser = (key, newValue) => this.setState({[key]: newValue })

	initialOvertimeChanged 		= (val) => this.updateUser('initialOvertime', val)
	nameInputChanged 					= (val) => this.updateUser('name', val)
	emailInputChanged 				= (val) => this.updateUser('email', val)
	positionChanged 					= (val) => this.updateUser('position', val.value)
	branchesChanged 					= (val) => this.updateUser('branches', val.reduce((acc, val) => ({ ...acc, [val.value]: true }) , {}))

	workDaysChanged = (workDays) => {
		const hoursSum = sumWorkHours(_.values(workDays))
		const latestSW = _.keys(this.state.weeklyHours).sort().reverse()[0]
		const weeklyHours = { ...this.state.weeklyHours, [latestSW]: hoursSum}
		this.setState({ workDays, weeklyHours})
	}

	weeklyHoursChanged = (weeklyHours) => {
		const latestKW = _.keys(weeklyHours).sort().reverse()[0]
		const h 			 = getAverageHours(weeklyHours[latestKW], _.keys(this.state.workDays).length)
		let workDays = { ...this.state.workDays }
		_.keys(this.state.workDays).forEach(w => workDays[w] = h)
		this.setState({ weeklyHours, workDays })
	}

	render() {
		const { name, email, weeklyHours, position, branches, status, initialOvertime, workDays } = this.state
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
									<FlatInput value={name} onInputChange={this.nameInputChanged} defaultText='Max Mustermann'/>
							</FlatFormRow>
							<FlatFormRow label='Email'>
									{ status === 'active'
										?	<WithTooltip text='Aktivierte Email adressen können nur vom Mitarbeiter selbst geändert werden.'>
												<fb className="emailFrozen">{email}</fb>
											</WithTooltip>
										: <FlatInput value={email} onInputChange={this.emailInputChanged} defaultText='max@gmail.de'/>
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
										onChange={this.positionChanged}
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
											onChange={(newVal) => this.branchesChanged(newVal)}
											searchable={false}
											placeholder='Filiale wählen'
										/>
									</div>
								</FlatFormRow>
							}
							<FlatFormRow label='Wochenstunden'>
								<WeeklyHoursInput weeklyHours={weeklyHours} setWeeklyHours={(this.weeklyHoursChanged)} extendable={editMode}/>
							</FlatFormRow>
						</fb>
						<Expander label='Überstunden'>
							<InitialOvertime
								initialOvertime={initialOvertime}
								changeInitialOvertime={this.initialOvertimeChanged}
							/>
						</Expander>
						<Expander label='Abwesenheit'>
							<fb style={{padding: '10px 0px'}}>
								<WorkDaysPicker workDays={workDays} onChange={this.workDaysChanged} />
							</fb>
						</Expander>
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
