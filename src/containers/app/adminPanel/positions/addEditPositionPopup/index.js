import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import FlatFormRow from 'components/flatFormRow'
import { savePositionToDB } from 'actions'
import { getNextID } from 'helpers'
import './styles.css';

class AddEditPositionPopup extends PureComponent {

	state = { positionName:  this.props.position ? this.props.position.name : '' }

	getRandomColor = () => 'red'
	getNextAvailableID = () => getNextID( 'p', this.props.positions.length + 1)

	saveButtonClicked = () => {
		const editMode = this.props.position
		if(editMode)  savePositionToDB({ ...this.props.position, name: this.state.positionName })
		if(!editMode) savePositionToDB({ id: this.getNextAvailableID(), color: this.getRandomColor(), name: this.state.positionName })
		this.props.closeModal()
	}

	render() {
		const { positionName } = this.state

		return (
			<SModal.Main title={ this.props.position ? 'Filiale bearbeiten' : 'Filiale erstellen' } onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditPositionPopupMain">
						<FlatFormRow label='Name der Filiale'>
								<FlatInput value={positionName} onInputChange={(inp) => this.setState({positionName: inp})} autoFocus/>
						</FlatFormRow>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton
						right
						label='speichern'
						onClick={this.saveButtonClicked}
						disabled={!positionName}
						color={'#2ECC71'}
					/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

const mapStateToProps = (state) => ({
	positions: state.core.positions,
})

export default connect(mapStateToProps)(AddEditPositionPopup)
