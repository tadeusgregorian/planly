//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import FlatFormRow from 'components/flatFormRow'
import { saveBranchToDB, deleteBranch } from 'actions/index'
import { getNextID } from 'helpers/index'
import { openModal } from 'actions/ui/modals'


import type { Branch, Location } from 'types/index'

import LocationsEditor from './locationsEditor'
import './styles.css';

type Props = {
	closeModal: Function,
	branches: Array<Branch>,
	branch: Branch,
	openModal: Function,
	deleteBranch: (branchID: string)=>any,
}

type State = {
	id: string,
	name: string,
	locations: {}
}

class AddEditBranchPopup extends PureComponent {
	props: Props
	state: State


	constructor(props){
		super(props)

		const { branch, branches } = props

		this.state = {
			id: branch ? branch.id : getNextID('b', branches.length + 1),
			name:  branch ? branch.name : '',
			locations: branch ? (branch.locations || null) : {}
		}
	}

	saveButtonClicked = () => {
		saveBranchToDB(this.state)
		this.props.closeModal()
	}

	updateLocation = (loc: Location) => {
		const newLoc = {[loc.id]: loc}
		this.setState({ locations: { ...this.state.locations, ...newLoc }})
	}

	deleteLocation = (loc: Location) => {
		const newLoc = {[loc.id]: { ...loc, deleted: true }}
		this.setState({ locations: { ...this.state.locations, ...newLoc }})
	}

	tryToDeleteBranch = () => {
		const props = {
			onAccept: () => this.props.deleteBranch(this.state.id).then(this.props.closeModal),
			acceptBtnLabel: 'Löschen',
			acceptBtnRed: true,
			title: 'Filiale löschen',
			text: `Soll die Filiale ${this.state.name} wirklich gelöscht werden ?`
		}
		this.props.openModal('CONFIRMATION', props)
	}

	render() {
		const { name, locations } = this.state
		const activeBranches = this.props.branches.filter(b => !b.deleted)
		const creationMode = !this.props.branch
		const title = !creationMode ? 'Filiale bearbeiten' : 'Filiale erstellen'

		return (
			<SModal.Main title={title} onClose={this.props.closeModal} className='addEditBranchPopupMain'>
				<SModal.Body>
					<fb className="addEditBranchPopupContent">
						<FlatFormRow label='Name der Filiale'>
								<FlatInput value={name} onInputChange={(inp) => this.setState({name: inp})} autoFocus/>
						</FlatFormRow>
						<FlatFormRow label='Bereiche'>
							<LocationsEditor locations={locations} updateLocation={this.updateLocation} deleteLocation={this.deleteLocation}/>
						</FlatFormRow>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					{ !creationMode && activeBranches.length > 1 &&
						<fb onClick={this.tryToDeleteBranch} data-balloon={'Filiale löschen'}>
							<fb className='icon icon-bin deleteBtn' />
						</fb>
						}
					<SButton right
						label='speichern'
						onClick={this.saveButtonClicked}
						disabled={!name}
						color={'#2ECC71'}
					/>
				</SModal.Footer>
			</SModal.Main>
		)
	}
}

const actionCreators = {
	openModal,
	deleteBranch
}

const mapStateToProps = (state) => ({
	branches: state.core.branches,
})

export default connect(mapStateToProps, actionCreators)(AddEditBranchPopup)
