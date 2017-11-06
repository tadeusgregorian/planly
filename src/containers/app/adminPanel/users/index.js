//@flow

import React from 'react'
import _ from 'lodash'
import {connect} from 'react-redux'
import UserElement from './user'
import { openModal } from 'actions/ui'
import SButton from 'components/sButton'
import './styles.css';

class AdminpanelUsers extends React.Component {

	tryToDeleteUser = () => { console.log('tryToDeleteUser')}
	openReactivateUserPopup = () => { console.log('openReactivateUserPopup')}
	openAddEditUserPopup = (user = null) => this.props.openModal('ADD_EDIT_USER', { user })


	render() {
		return (
			<div className="adminpanelUsers">
				<fb className="headline">
					<fb className="headlineText">Mitarbeiter verwalten</fb>
					<SButton slick icon='icon-add' label='Nutzer hinzufügen' onClick={() => this.openAddEditUserPopup()} />
				</fb>
					<fb className='headRow'>
						<fb className='item name'>Name</fb>
						<fb className='item position'>Rolle</fb>
						<fb className='item branches'>Standort</fb>
						<fb className='item status'>Status</fb>
					</fb>
				{_.sortBy(this.props.users, ['name']).map(user => (
					<UserElement
						user={user}
						userClicked={this.openAddEditUserPopup}
						key={user.id}
						branches={this.props.branches.filter(b => !!user.branches[b.id])}
						position={this.props.positions.find(pos => pos.id === user.position)}
					/>))
				}
			</div>
		);
	}
}

const mapDispatchToProps = {
	openModal
}

const mapStateToProps = (state) => ({
	users: 			state.core.users,
	positions: 	state.core.positions,
	branches: 	state.core.branches,
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelUsers);
