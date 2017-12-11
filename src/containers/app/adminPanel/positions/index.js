//@flow
import React from 'react';
import {connect} from 'react-redux';
import sortBy from 'lodash/sortBy'
import PositionElement from './position';
import { rearrangePositions } from 'actions/positions'
import { openModal } from 'actions/ui'
import SButton from 'components/sButton'
import type { Position, Store } from 'types/index'
import {SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import './styles.css';

const DragHandle = SortableHandle(() => <fb className='dragHandle'>|||</fb>)

const SortableItem = SortableElement(({position, onClick}) =>
  <li className='positionItemWrapper'>
		<DragHandle />
		<PositionElement
			position={position}
			onClick={onClick}
			key={position.id}
		/>
	</li>
);

const SortableList = SortableContainer(({items, onClick}) => {
	return (
		<ul>
			{sortBy(items, 'nr').map((position, i) => (
				<SortableItem
					key={position.id}
					index={position.nr}
					position={position}
					onClick={onClick}
				/>
			))}
		</ul>
	);
});

type Props = { positions: Array<Position>, openModal: Function }

class AdminpanelPositions extends React.Component {
  props: Props

	openAddEditPositionPopup = (position = null) => {
		this.props.openModal('ADD_EDIT_POSITION', { position })
	}

	onSortEnd = ({oldIndex, newIndex}) => {
    const { positions } = this.props
    const sequence = []
    positions.forEach(p => sequence[p.nr] = p.id )
    const item = sequence.splice(oldIndex, 1)[0]
    sequence.splice(newIndex, 0, item)
    const newWorldOrder = positions.map(p => ({ id: p.id, nr: sequence.indexOf(p.id) }))
    rearrangePositions(newWorldOrder);
	}

	render() {
		return (
			<div className="adminpanelPositions">
				<fb className="headline">
					<fb className="headlineText">Rollen verwalten</fb>
					<SButton slick icon='icon-add' label='Rolle hinzufügen' onClick={() => this.openAddEditPositionPopup()} />
				</fb>
				<SortableList
					useDragHandle={true}
					onSortEnd={this.onSortEnd}
					items={this.props.positions}
					onClick={this.openAddEditPositionPopup}
				/>
			</div>
		)
	}
}

const mapDispatchToProps = {
	openModal
}

const mapStateToProps = (state: Store) => ({
	positions: 	state.core.positions,
})


export default connect(mapStateToProps, mapDispatchToProps)(AdminpanelPositions)
