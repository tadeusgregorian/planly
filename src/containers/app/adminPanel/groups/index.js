import React from 'react';
import { connect } from 'react-redux';
import { addNewGroup, editGroup, deleteGroup } from 'actions'
import { openConfirmPopup, closeConfirmPopup } from 'actions/ui/core'
import {bindActionCreators} from 'redux';
import ConfirmPopup from 'components/confirmPopup'
import AddEditGroupPopup from './addEditGroupPopup';
import Group from './group'
import Dialog from 'material-ui/Dialog';
import './styles.css';


class AdminpanelGroups extends React.Component {
	constructor(props) {
		super(props)

		this.state = { createGroupPopupOpen: false }
	}

	openAddEditGroupPopup = (editing = false, group = null) => {
		this.createGroupPopup = <AddEditGroupPopup
			onClose={() => this.setState({createGroupPopupOpen: false})}
			addNewGroup={addNewGroup}
			editGroup={editGroup}
			group={group}
			editing={editing}/>
		this.setState({createGroupPopupOpen: true});
	}

	openDeleteGroupPopup = (group) => {
		const confPop = <ConfirmPopup
			title={'Gruppe löschen'}
			text={<p>Soll Die Gruppe <strong>{group.name}</strong> wirklich gelöscht werden?</p>}
			onAccept={() => deleteGroup(group.id, this.props.users)}
			onClose={this.props.closeConfirmPopup}
			acceptBtnLabel='Löschen'
			declineBtnLabel='Abbrechen'
			acceptBtnRed={true}
		/>
		this.props.openConfirmPopup(confPop)
	}


	render() {
		return (
			<fb className="edit-groups">
				<fb className="new-group-button-wrapper">
					<button className="button icon-folder-plus" onClick={() => this.openAddEditGroupPopup()}>Gruppe Hinzufügen</button>
				</fb>
				{ this.props.groups.map(group =>
					<Group
						key={group.id}
						group={group}
						users={this.props.users}
						openAddEditGroupPopup={this.openAddEditGroupPopup}
						openDeleteGroupPopup={this.openDeleteGroupPopup}
					/>
				)}
				<Dialog
					bodyClassName="sModal"
					open={!!this.state.createGroupPopupOpen}
					onRequestClose={() => this.setState({createGroupPopupOpen: false})}>
					{this.createGroupPopup}
				</Dialog>
			</fb>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		openConfirmPopup,
		closeConfirmPopup,
	}, dispatch);
};

const mapStateToProps = (state) => ({ groups: state.data.groups, users: state.data.users })
export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelGroups);
