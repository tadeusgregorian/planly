import React from 'react';
import {connect} from 'react-redux';
import UserElement from './user';
import { addNewUser, editUser, deleteUser, reactivateUser } from 'actions'
import { openModal } from 'actions/ui'
import AddEditUserPopup from './addEditUserPopup'
import SButton from 'components/sButton'
import './styles.css';

class AdminpanelUsers extends React.Component {

	openAddEditUserPopup = (editing = false, user = null) => {
		const { users, branches, groups } = this.props
		const usersCount = users.length
		this.props.openModal('addEditUser', AddEditUserPopup, { usersCount, editing, user, branches, groups, editUser, addNewUser })
	}

	render() {
		return (
			<div className="edit-users-content">
				<fb className="newUserButtonWrapper">
					<SButton label='Nutzer hinzufügen' onClick={() => this.openAddEditUserPopup()} />
				</fb>
				{this.props.users.map(user => (
					<UserElement
						user={user}
						key={user.id}
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
		addNewUser,
		editUser,
		openModal
};

const mapStateToProps = (state) => ({
	users: state.core.users,
	groups: state.core.positions,
	branches: state.core.branches,
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelUsers);
