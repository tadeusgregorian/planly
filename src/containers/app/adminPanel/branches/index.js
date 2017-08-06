import React from 'react';
import { connect } from 'react-redux';
import { addNewBranch, editBranch, deleteBranch } from 'actions'
import { openConfirmPopup, closeConfirmPopup } from 'actions/ui/core'
import {bindActionCreators} from 'redux';
import ConfirmPopup from 'components/confirmPopup'
import AddEditBranchPopup from './addEditBranchPopup';
import Branch from './branch'
import Dialog from 'material-ui/Dialog';
import './styles.css';


class AdminpanelBranches extends React.Component {
	constructor(props) {
		super(props)

		this.state = { addEditBranchPopupOpen: false }
	}

	openAddEditBranchPopup = (editing = false, branch = null) => {
		// the admin user gets automatically added to a newly created branch
		this.addEditBranchPopup = <AddEditBranchPopup
			onClose={() => this.setState({addEditBranchPopupOpen: false})}
			addNewBranch={(branchName) => addNewBranch(branchName, this.props.selectedUser)}
			editBranch={editBranch}
			branch={branch}
			editing={editing}/>
		this.setState({addEditBranchPopupOpen: true})
	}

	openDeleteBranchPopup = (branch) => {
		const confPop = <ConfirmPopup
			title={'Filiale löschen'}
			text={<p>Soll Die Filiale <strong>{branch.name}</strong> wirklich gelöscht werden?</p>}
			onAccept={() => deleteBranch(branch.id, this.props.users)}
			onClose={this.props.closeConfirmPopup}
			acceptBtnLabel='Löschen'
			declineBtnLabel='Abbrechen'
			acceptBtnRed={true}
		/>
		this.props.openConfirmPopup(confPop)
	}

	render() {
		return (
			<fb className="edit-branches">
				<fb className="new-branch-button-wrapper">
					<button className="button icon-folder-plus" onClick={() => this.openAddEditBranchPopup()}>Filiale Hinzufügen</button>
				</fb>
				{ this.props.branches.map(branch =>
					<Branch
						key={branch.id}
						branch={branch}
						users={this.props.users}
						openAddEditBranchPopup={this.openAddEditBranchPopup}
						openDeleteBranchPopup={this.openDeleteBranchPopup}
					/>
				)}
				<Dialog
					bodyClassName="sModal"
					open={!!this.state.addEditBranchPopupOpen}
					onRequestClose={() => this.setState({addEditBranchPopupOpen: false})}>
					{this.addEditBranchPopup}
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

const mapStateToProps = (state) => ({
	branches: state.data.branches,
	users: state.data.users,
	selectedUser: state.core.selectedUser
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelBranches);
