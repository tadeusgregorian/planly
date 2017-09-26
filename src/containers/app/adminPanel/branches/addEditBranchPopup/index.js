//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import SModal from 'components/sModal'
import SButton from 'components/sButton'
import FlatInput from 'components/flatInput'
import FlatFormRow from 'components/flatFormRow'
import { saveBranchToDB } from 'actions/index'
import { getNextID } from 'helpers/index'

import type { Branch, Location } from 'types/index'

import LocationsEditor from './locationsEditor'
import './styles.css';

type Props = {
	closeModal: Function,
	branches: Array<Branch>,
	branch: Branch
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
			locations: branch ? branch.locations : {}
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

	render() {
		const { name, locations } = this.state

		return (
			<SModal.Main title={ this.props.branch ? 'Filiale bearbeiten' : 'Filiale erstellen' } onClose={this.props.closeModal}>
				<SModal.Body>
					<fb className="addEditBranchPopupMain">
						<FlatFormRow label='Name der Filiale'>
								<FlatInput value={name} onInputChange={(inp) => this.setState({name: inp})} autoFocus/>
						</FlatFormRow>
						<FlatFormRow label='Bereiche'>
							<LocationsEditor locations={locations} updateLocation={this.updateLocation} deleteLocation={this.deleteLocation}/>
						</FlatFormRow>
					</fb>
				</SModal.Body>
				<SModal.Footer>
					<SButton
						right
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

const mapStateToProps = (state) => ({
	branches: state.core.branches,
})

export default connect(mapStateToProps)(AddEditBranchPopup)
