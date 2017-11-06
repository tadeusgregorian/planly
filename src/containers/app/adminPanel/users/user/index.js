//@flow
import React from 'react';
import type { User, Position, Branch } from 'types/index'
import './styles.css';

type Props = {
	userClicked: Function,
	user: User,
	position: Position,
	branches: Array<Branch>
}

export default (props: Props) => {

	const {userClicked, user, position, branches } = props
	const {deleted, name} = user

	const displayBranches = () =>
		branches.reduce((acc, val) =>  acc + ( acc && ' / ' ) + val.name, '')

	const displayStatus = () => {
		switch (user.status) {
			case 'NOT_INVITED': return 'inaktiv'
			case 'INVITED'    : return 'eingeladed'
			case 'ACTIVE'			: return 'aktiv'
			default: return 'error-'
		}
	}


	if(deleted) {
		return (
			<fb className='adminPanelUserItem deleted'>
				<fb className="userName">{name}</fb>
			</fb>
		)
	}

	return(
		<fb className='adminPanelUserItem' onClick={() => userClicked(user)}>
			<fb className="item name">{name}</fb>
			<fb className="item position" style={{color: position.color}}>
				<fb className="icon positinIcon icon-bookmark"></fb>
				<fb className="positionText">{position.name}</fb>
			</fb>
			<fb className='item branches' data-balloon={displayBranches()}>
				<div className='text'>{ displayBranches() }</div>
			</fb>
			<fb className='item status'>{displayStatus()}</fb>
		</fb>
  )
}
