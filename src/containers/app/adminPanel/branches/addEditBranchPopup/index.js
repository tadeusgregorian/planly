import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import FlatFormRow from 'components/flatFormRow'
import { saveBranchToDB } from 'actions'
import { numToTriplex } from 'helpers'
import './styles.css';

class AddEditUserPopup extends PureComponent {

	state = { branchName:  this.props.branch ? this.props.branch.name : '' }

	getRandomColor = () => 'red'
	getNextAvailableID = () => numToTriplex(this.props.branches.length + 1)

	saveButtonClicked = () => {
		const editMode = this.props.branch
		if(editMode)  saveBranchToDB({ ...this.props.branch, name: this.state.branchName })
		if(!editMode) saveBranchToDB({ id: this.getNextAvailableID(), color: this.getRandomColor(), name: this.state.branchName })
		this.props.closeModal()
	}

	render() {
		const { branchName } = this.state

		return (
			<SModal.Main title={ this.props.branch ? 'Filiale bearbeiten' : 'Filiale erstellen' } onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditBranchPopupMain">
						<FlatFormRow label='Name der Filiale'>
								<FlatInput value={branchName} onInputChange={(inp) => this.setState({branchName: inp})} autoFocus/>
						</FlatFormRow>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton
						right
						label='speichern'
						onClick={this.saveButtonClicked}
						disabled={!branchName}
						color={'#2ECC71'}
					/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

const mapStateToProps = (state) => ({
	branches: state.core.branches,
})

export default connect(mapStateToProps)(AddEditUserPopup)
