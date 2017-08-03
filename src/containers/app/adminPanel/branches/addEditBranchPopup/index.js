import React, { PureComponent } from 'react'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import './styles.css';

export default class AddEditBranchPopup extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			branchName: this.props.editing ? this.props.branch.name : ''
		}
	}

	onButtonClicked = () => {
		if(this.state.branchName.length < 2) return
		this.props.editing ?
			this.props.editBranch({ ...this.props.branch, name: this.state.branchName}) :
			this.props.addNewBranch(this.state.branchName)

		this.props.onClose()
	}

	onInputChanged = (input) => {
		this.setState({branchName: input.target.value})
	}

	render() {
		const title = this.props.editing ? 'Filieale bearbeiten' : 'Neue Filieale erstellen'
		return (
			<SModal.Main onClose={this.props.onClose} title={title}>
				<SModal.Body>
					<fb className="addEditBranchMain">
						<input
							type="text"
							value={this.state.branchName}
							className="branchNameInput"
							placeholder="Name der Filiale"
							onChange={this.onInputChanged}
							onKeyDown={(e) => e.keyCode === 13 && this.onButtonClicked()}
							autoFocus />
						<SButton
							label='BESTÄTIGEN'
							disabled={this.state.branchName.length < 2}
							onClick={this.onButtonClicked}
							color={'#2ecc71'}
						/>
					</fb>
				</SModal.Body>
			</SModal.Main>

		);
	}
}
