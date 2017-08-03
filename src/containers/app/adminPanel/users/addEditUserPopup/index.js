import React, { Component } from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import ChipBar from 'components/chipBar'
import _ from 'lodash'
import './styles.css';

export default class AddEditUserPopup extends Component {
	constructor(props) {
		super(props);

		const editing = this.props.editing
		const user = this.props.user

		this.state = {
			name: 					editing ? user.name : '',
			nameInitials: 	editing ? user.nameInitials : '',
			color: 					editing ? user.color : '',
			branches: 			editing ? _.keys(user.branches) : this.getDefaultBranch(),
			assignedGroups: editing ? _.keys(user.assignedGroups) : [], // it is called assignedGroups, but its only allowed 1 group. TODO: dont know if this is final
			userinputMissingText: '',
		};
	}

	getDefaultBranch = () => {
		//attention: props.branches are branches of the account in this form: [{name: xyz, ID: 2929}] AND state.branches are user branches arr: [id01, id02]
		// if only one branch exists, return that one, else empty ( think if the case, that thers only one branch in this account - the branch option is hidden in that case)
		return this.props.branches.length === 1 ? [this.props.branches[0].ID] : []
	}

	onButtonClicked = () => {
		if(this.state.name === '') {
			this.setState({userinputMissingText: 'Bitte geben Sie einen Benutzernamen ein.'})
			return;
		}
		if(this.state.nameInitials.length < 4) {
			this.setState({userinputMissingText: 'Bitte geben Sie einen 4 stelligen Namenskürzel ein.'})
			return;
		}
		if(this.state.color === '') {
			this.setState({userinputMissingText: 'Bitte wählen Sie eine Farbe aus.'})
			return;
		}

		if(!this.state.branches.length){
			this.setState({userinputMissingText: 'Bitte wählen Sie mindestens eine Filiale aus.'})
			return;
		}

		if(!this.state.assignedGroups.length){
			this.setState({userinputMissingText: 'Bitte wählen Sie eine Gruppe aus.'})
			return;
		}

		let userObj 						= { ...this.props.user }
		userObj.name 						= this.state.name
		userObj.nameInitials 		= this.state.nameInitials
		userObj.color 					= this.state.color
		userObj.assignedGroups  = this.state.assignedGroups.reduce((acc, val) => ({ ...acc, [val]: 1}), {})
		userObj.branches 				= this.state.branches.reduce((acc, val) => ({ ...acc, [val]: 1}), {})

		if(this.props.editing) {
			if(!this.props.user.ID) { return }  // in editing user.ID has to be existent!
			userObj.ID = this.props.user.ID; // add ID to the userObj if you want to use the editUser-Action
			this.props.editUser(userObj)

		} else {
			this.props.addNewUser({ ...userObj, ID:  this.getIncrementalUserID() })
		}
		this.props.close()
	}

	getIncrementalUserID = () => {
		// the schema is u001, u012, ...
		const userNumber = this.props.usersCount + 1
		if(userNumber < 10) 	return ('u00' + userNumber)
		if(userNumber < 100) 	return ('u0' + userNumber)
		if(userNumber < 1000) return ('u' + userNumber)
		throw new Error('never to be reached: This means there are more than 1000 users?')
	}

	onNameInputChanged(input) {
		this.setState({name: input.target.value})
	}

	branchChipClicked = (bID) => {
		const currentBs = this.state.branches
		const newBs = _.includes(currentBs, bID) ? _.without(currentBs, bID) : [ ...currentBs, bID ]
		this.setState({branches: newBs})
	}

	groupChipClicked = (gID) => {
		//TODO:  there is only one group allowed, not more , not less ( dont know if this is final though... )
		const currentGs = this.state.assignedGroups
		const newGs = _.includes(currentGs, gID) ? [] : [ gID ]
		this.setState({assignedGroups: newGs})
	}

	render() {
		return (
				<SModal.Main title='Neuer Benutzer' onClose={this.props.onClose}>
					<SModal.Body>
				<fb className="addEditUserPopup">
					{ this.state.userinputMissingText ? <fb className="userinputMissingText">{this.state.userinputMissingText}</fb> : null}
					<fb className="inputItemWrapper">
						<fb className="inputDescription" >Benutzername:</fb>
						<input className="nameInputField" type="text" value={this.state.name} autoFocus onChange={this.onNameInputChanged.bind(this)}/>
					</fb>
					{	this.props.branches.length > 1 &&
						<fb className="inputItemWrapper">
							<fb className="inputDescription">Filiale:</fb>
							<fb className="branchesWrapper">
								<ChipBar
									chips={this.props.branches}
									selectedChips={this.state.branches}
									chipClicked={this.branchChipClicked}/>
							</fb>
						</fb>
					}
					<fb className="inputItemWrapper">
						<fb className="inputDescription">Gruppe:</fb>
						<fb className="branchesWrapper">
							<ChipBar
								chips={this.props.groups}
								selectedChips={this.state.assignedGroups}
								chipClicked={this.groupChipClicked}/>
						</fb>
					</fb>
				</fb>
			</SModal.Body>
			<SModal.Footer>
				<SButton
					left
					label='open fake'
					onClick={this.props.openAnother}
					color={'red'}
				/>
				<SButton
					right
					label={this.props.editing ? 'speichern' : 'Nurtzer Erstellen'}
					onClick={this.onButtonClicked}
					disabled={false}
					color={'#2ECC71'}
				/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}
