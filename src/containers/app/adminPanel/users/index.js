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

	onSortEnd = ({oldIndex, newIndex}) => {
		console.log(oldIndex)
		console.log(newIndex)
 	}


	render() {
		return (
			<div className="adminpanelUsers">
				<fb className="headline">
					<fb className="headlineText">Mitarbeiter verwalten</fb>
					<SButton slick icon='icon-add' label='Nutzer hinzufügen' onClick={() => this.openAddEditUserPopup()} />
				</fb>
				{_.sortBy(this.props.users, ['sort']).map(user => (
					<UserElement
						user={user}
						userClicked={this.openAddEditUserPopup}
						key={user.id}
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
