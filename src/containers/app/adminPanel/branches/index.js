import React from 'react';
import {connect} from 'react-redux';
import BranchElement from './branch';
import { openModal } from 'actions/ui'
import SButton from 'components/sButton'
import './styles.css';

class AdminpanelBranchs extends React.Component {

	openAddEditBranchPopup = (branch = null) => {
		this.props.openModal('ADD_EDIT_BRANCH', { branch })
	}

	render() {
		return (
			<div className="adminpanelBranches">
				<fb className="headline">
					<fb className="headlineText">Filialen verwalten</fb>
					<SButton slick icon='icon-add' label='Filiale hinzufügen' onClick={() => this.openAddEditBranchPopup()} />
				</fb>
				{this.props.branches.map(branch => (
					<BranchElement
						branch={branch}
						branchClicked={this.openAddEditBranchPopup}
						key={branch.id}
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
	branches: 	state.core.branches,
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelBranchs)
