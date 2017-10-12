//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ColorPicker from 'components/colorPicker'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import FlatFormRow from 'components/flatFormRow'
import { getRandomColor } from 'constants/colors'
import { savePositionToDB } from 'actions/positions'
import { getNextID } from 'helpers/index'
import './styles.css';

class AddEditPositionPopup extends PureComponent {

	state = {
		id: 			this.props.position ? this.props.position.id 			 : this.getNextAvailableID(),
		name:  		this.props.position ? this.props.position.name     : '',
		shortcut: this.props.position ? this.props.position.shortcut : '',
		color: 		this.props.position ? this.props.position.color 	 : getRandomColor(),
	}

	getNextAvailableID = () => getNextID( 'p', this.props.positions.length + 1)

	saveButtonClicked = () => {
		savePositionToDB(this.state)
		this.props.closeModal()
	}

	render() {
		const { name, shortcut, color } = this.state

		return (
			<SModal.Main title={ this.props.position ? 'Filiale bearbeiten' : 'Filiale erstellen' } onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditPositionPopupMain">
						<FlatFormRow label='Name der Position'>
								<FlatInput value={name} onInputChange={(inp) => this.setState({name: inp})} autoFocus/>
						</FlatFormRow>
						<FlatFormRow label='Kürzel'>
								<FlatInput value={shortcut} onInputChange={(inp) => this.setState({shortcut: inp})} maxLength='3' defaultText='3 stellig' />
						</FlatFormRow>
						<FlatFormRow label='Farbe'>
							<fb className='colorBox' id='addEditPositionPopup_colorBox' style={{background: color}}/>
							<ColorPicker targetID='addEditPositionPopup_colorBox' onPick={(color)=>{this.setState({color})}} />
						</FlatFormRow>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton
						right
						label='speichern'
						onClick={this.saveButtonClicked}
						disabled={!name || !shortcut}
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
