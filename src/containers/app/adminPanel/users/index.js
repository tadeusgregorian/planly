import React from 'react';
import {connect} from 'react-redux';
import UserElement from './user';
import {addNewUser, editUser, deleteUser, reactivateUser} from 'actions/index'
import AddEditUserPopup from './addEditUserPopup';
import { Toast } from 'helpers';
import './styles.css';

class AdminpanelUsers extends React.Component {
	constructor(props) {
		super(props);

		this.state = { addEditUserPopup_open: false }
	}

	tryToDeleteUser = (user) => {
		user.isAdmin ?
			Toast.error("der Admin-User darf nicht gelöscht werden.") :
			this.openDeleteUserPopup(user)
	}

	openAddEditUserPopup = (editing = false, user = null) => {
			this.setState({addEditUserPopup_open: true});
			this.addEditUserPopup = <AddEditUserPopup
				editing={editing}
				user={user}
				close={this.closeAddEditUserPopup}
				usersCount={this.props.users.length}
				branches={this.props.branches}
				groups={this.props.groups}
				selectedBranch={this.props.selectedBranch}
				editUser={editUser}
				addNewUser={addNewUser}
			/>
	}

	closeAddEditUserPopup = () => this.setState({addEditUserPopup_open: false})

	openDeleteUserPopup = (user) => {
		// const confPop = <ConfirmPopup
		// 	title={'Mitarbeiter löschen'}
		// 	text={<p>Soll <strong>{user.name}</strong> wirklich geslöscht werden ?</p>}
		// 	onAccept={() => deleteUser(user.ID)}
		// 	onClose={this.props.closeConfirmPopup}
		// 	acceptBtnLabel='Löschen'
		// 	declineBtnLabel='Abbrechen'
		// 	acceptBtnRed={true}
		// />
		// this.props.openConfirmPopup(confPop)
	}

	render() {
		return (
			<div className="edit-users-content">
				<fb className="newUserButtonWrapper">
					<button className="icon-plus button newUserButton" onClick={() => this.openAddEditUserPopup()}>
						neuen nutzer anlegen
					</button>
				</fb>
				{this.props.users.map(user => (
					<UserElement
						user={user}
						key={user.ID}
						deleteUser={this.tryToDeleteUser}
						reactivateUser={this.openReactivateUserPopup}
						editUser={this.openAddEditUserPopup}
					/>))
				}
			</div>
		);
	}
}

const mapDispatchToProps = {
		//openConfirmPopup,
		//closeConfirmPopup,
		addNewUser,
		editUser
};

const mapStateToProps = (state) => ({
	users: state.data.users,
	groups: state.data.groups,
	branches: state.data.branches,
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelUsers);
