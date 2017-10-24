import React from 'react';
import {connect} from 'react-redux';
import PositionElement from './position';
import { openModal } from 'actions/ui'
import SButton from 'components/sButton'
import './styles.css';

class AdminpanelPositions extends React.Component {

	openAddEditPositionPopup = (position = null) => {
		this.props.openModal('ADD_EDIT_POSITION', { position })
	}

	render() {
		return (
			<div className="adminpanelPositions">
				<fb className="headline">
					<fb className="headlineText">Filialen verwalten</fb>
					<SButton slick icon='icon-add' label='Position hinzufügen' onClick={() => this.openAddEditPositionPopup()} />
				</fb>
				{this.props.positions.map(position => (
					<PositionElement
						position={position}
						positionClicked={this.openAddEditPositionPopup}
						key={position.id}
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
	positions: 	state.core.positions,
})


export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelPositions)
