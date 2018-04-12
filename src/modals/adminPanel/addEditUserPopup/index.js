//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import omit from 'lodash/omit'
import mapValues from 'lodash/mapValues'
import { beginningOfTime } from 'constants/roster'
import { Toast } from 'helpers/iziToast'
import { saveUserToDB, addInvitationJob, deleteUser } from 'actions/users'
import { openModal } from 'actions/ui/modals'

import SModal 					from 'components/sModal'
import SButton 					from 'components/sButton'
import FlatInput 				from 'components/flatInput'
import FlatFormRow 			from 'components/flatFormRow'
import WorkDaysPicker		from 'components/workDaysPicker'
import SSwitch          from 'components/sSwitch/index';

import EmailStatus 				from './emailStatus'
import ErrorMessageBar  	from './errorMessageBar'
import PositionSelect  		from './positionSelect'
import BranchSelect 			from './branchSelect'
import WeeklyHoursInput 	from './weeklyHoursInput'

import { getNextID, isValidEmail, isFloatStr, replaceDotsWithCommas } from 'helpers/index'
import { floatToMins, minsToFloat, getAvgDailyMins, minsToDetailedTime, getLatest, areAllValidFloats } from './localHelpers'
import type { UserStatus, Store, User, WorkDays } from 'types/index'
import './styles.css'

class AddEditUserPopup extends PureComponent {
	state: {
		id: 							string,
		name: 						string,
		email: 						string,
		branches: 				{},
		position: 				string,
		status: 					UserStatus,
    monthly:          ?true,
    monthlyHours:     ?{ [smartMonth: string]: string },
		weeklyHours: 			{ [smartWeek: string]: string },
		workDays: 				WorkDays,
		errorText: 				string,
	}

	constructor(props) {
		super(props);

		const { users, branches, user } = this.props

		const getDefaultBranch 	= () => branches.length === 1 ? {[branches[0].id]: true} : {}
		const getFreshUserID		= () => getNextID('u', users.length + 1)

		this.state = {
			id: 							user ? user.id 					    : getFreshUserID(),
			name: 						user ? user.name 				    : '',
			email: 						user ? user.email 			    : '',
			branches: 				user ? user.branches 		    : getDefaultBranch(),
			position: 				user ? user.position 		    : 'p001',
			status: 					user ? user.status 			    : 'NOT_INVITED',
      monthly:          user ? user.monthly || null : null,
      workDays: 				user ? user.workDays 		    : { mo: 1, tu: 1, we: 1, th: 1, fr: 1, sa: 1 },
      monthlyHours:     this.getDefault_monthlyHours(),
			weeklyHours:      this.getDefault_weeklyHours(),  // we display weeklyHours -> but store the weeklyMins as integers in DB
			errorText: 				'',  // gets stripped away before saving to DB
		}
	}

	getDefault_weeklyHours = () => {
		return this.props.user
			? mapValues(this.props.user.weeklyMins, (mins => minsToFloat(mins)))
			: { [beginningOfTime]: '' } // its the default -> we dont pick the current smartWeek -> so shifts can be created for the past
	}

	getDefault_monthlyHours = () => {
		return this.props.user && this.props.user.monthlyMins
			? mapValues(this.props.user.monthlyMins, (mins => minsToFloat(mins)))
			: null
	}

	onSaveClicked = (invite: boolean) => {
		const { name, email, branches, position, weeklyHours, monthlyHours, monthly } = this.state
		let errorText = ''


		if(!Object.keys(branches).length)	  errorText = 'Bitte wählen Sie mindestens eine Filiale aus.'
		if(!position)											  errorText = 'Bitte wählen Sie eine Position aus.'
		if(!areAllValidFloats(weeklyHours)) errorText = 'Wochenstunden ungültig'
		if(email && !isValidEmail(email))  	errorText = 'Falsches Email-Format.'
		if(name === '') 									  errorText = 'Bitte geben Sie einen Benutzernamen ein.'
    if(monthly && (!monthlyHours || !areAllValidFloats(monthlyHours))) {
      errorText = 'Bitte geben Sie einen Benutzernamen ein.'
    }

		if(errorText) return this.setState({errorText}) // dont proceed here, if errorText is not falsy
		this.saveUser(invite)
		this.props.closeModal()
	}

	saveUser = (sendInvite: boolean) => {
		const { weeklyHours, monthlyHours } = this.state
		let dbUser: User  = {
			...this.props.user,   // props like 'isAdmin' are not in state, thats why doing ...user ( from props )
			...omit(this.state, ['errorText', 'weeklyHours', 'monthlyHours']), // weeklyHours and monthlyHours is just to display it here -> we store it as weeklyMins on DB
			weeklyMins: mapValues(weeklyHours, (h => floatToMins(h))),
      monthlyMins: monthlyHours ? mapValues(monthlyHours, (h => floatToMins(h))) : null
		}

		saveUserToDB(dbUser)
		sendInvite && this.sendInvitation()
	}

	sendInvitation = () => {
		const { name, id, email } = this.state
		const { accountID } = this.props

		this.setState({ status: 'INVITED' })
		Toast.success('Einladung gesendet an ' + email)
		addInvitationJob({ name, userID: id, email, accountID })
	}

	updateUser = (key, newValue) => this.setState({[key]: newValue })

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

  accountTypeChanged = (type) => {
    // 0 is weekly, 1 is monthly
    this.updateUser('monthly', type === 0 ? null : true)

    if (type === 0) this.updateUser('monthlyHours', null)
    if (type === 1) {
      this.updateUser('weeklyHours', { [beginningOfTime]: 0 })
      this.updateUser('monthlyHours', { [beginningOfTime]: 0 })
    }
  }

	tryToDeleteUser = () => {
		const props = {
			onAccept: ()=>deleteUser(this.state.id).then(this.props.closeModal),
			acceptBtnLabel: 'Löschen',
			acceptBtnRed: true,
			title: 'Mitarbeiter löschen',
			text: `Soll der Mitarbeiter ${this.state.name} wirklich gelöscht werden ?`
		}
		this.props.openModal('CONFIRMATION', props)
	}

	render() {
		const { name, email, weeklyHours, monthlyHours, position, branches, status, workDays, monthly } = this.state

		const allBranches 	= this.props.branches
		const allPositions 	= this.props.positions
		const editMode 			= !!this.props.user
		const validEmail    = isValidEmail(email)

		const avgHours 			= Math.round(getAvgDailyMins(workDays, getLatest(weeklyHours)) / 60 * 100) / 100
		const avgHoursStr 	= replaceDotsWithCommas(avgHours) + ' Stunden'
		const avgTimeStr    = minsToDetailedTime(getAvgDailyMins(workDays, getLatest(weeklyHours)))
		const avgTimeTTip   = 'Durchschnittliche tägliche Arbeitszeit: ' + avgTimeStr

		return (
			<SModal.Main title={ editMode ? 'Mitarbeiter bearbeiten' : 'Neuer Mitarbeiter' } onClose={this.props.closeModal} className='addEditUserPopupMain'>
				<SModal.Body>
					<fb className="addEditUserPopupBody">
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
              <FlatFormRow label='Arbeitszeit'>
                <SSwitch
                  options={['wöchentlich', 'monatlich']}
                  onChange={this.accountTypeChanged}
                  selected={monthly ? 1 : 0} />
              </FlatFormRow>
							<FlatFormRow label={monthly ? 'Monatsstunden' : 'Wochenstunden' }  >
                { monthly && monthlyHours // checking for monthlyHours aswell just to silence FLOW
                    ? <FlatInput value={monthlyHours[beginningOfTime]} onInputChange={(h) => this.updateUser('monthlyHours', { [beginningOfTime]: h })} />
                    : <WeeklyHoursInput weeklyHours={weeklyHours} setWeeklyHours={(weeklyHours) => this.setState({ weeklyHours })} extendable={editMode}/>
                }
							</FlatFormRow>
							<FlatFormRow label='Arbeitstage'>
								<WorkDaysPicker workDays={workDays} onChange={(wd) => this.setState({ workDays: wd })} noEmpty />
								<fb className='avgDailyHours'  data-balloon={avgTimeTTip} >&Oslash; {avgHoursStr}</fb>
						</FlatFormRow>
						</fb>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					{ editMode && <fb onClick={this.tryToDeleteUser} data-balloon={'Mitarbeiter löschen'}><fb className='icon icon-bin deleteBtn' /></fb> }
					<SButton right label='speichern' onClick={()=>this.onSaveClicked(false)} color={ (editMode || !validEmail) && '#2ECC71' } />
					{ !editMode && <SButton label='speichern & einladen' onClick={()=>this.onSaveClicked(true)} color='#2ECC71' disabled={ !validEmail } /> }
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

const actionCreators = {
	openModal
}

const mapStateToProps = (state: Store) => ({
	users: state.core.users,
	positions: state.core.positions,
	branches: state.core.branches,
	accountID: state.auth.accountID
})

export default connect(mapStateToProps, actionCreators)(AddEditUserPopup)
