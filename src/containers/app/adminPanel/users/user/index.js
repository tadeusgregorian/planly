import React, {PureComponent} from 'react';
import './styles.css';

export default class UserElement extends PureComponent {

	airplaneClicked = () => {
		this.props.isOnVacation ?
			this.props.putUserBackToWork(this.props.user.ID) :
			this.props.sendUserToVacation(this.props.user.ID)
	}

	render() {
		const {editUser, deleteUser, user, reactivateUser, isOnVacation} = this.props
		const {deleted, color, name} = user

		let airplaneStyle = {
			color: isOnVacation ? 'white' : '#6f6f6f',
			backgroundColor: isOnVacation ? '#ff5784' : '#e8e8e8'
		}

		if(deleted) {
			return (
				<fb className='userListItem deleted'>
					<fb className="color-box" style={{background: 'lightgrey' }}></fb>
					<fb className="userName">{name}</fb>
					<fb className="reactivateUserButton" onClick={() => reactivateUser(user)}>REAKTIVIEREN</fb>
				</fb>
			)
		}

		return(
  		<fb className='userListItem'>
    		<fb className="color-box" style={{background: color }}></fb>
				<fb className="userName">{name}</fb>
				<fb className='airplane icon icon-aircraft' style={airplaneStyle} onClick={this.airplaneClicked}></fb>
				<button className="editUserButton" onClick={() => { editUser(true, user)}}>bearbeiten</button>
				<icon onClick={ () => { deleteUser(this.props.user) }} className="icon-bin deleteUserButton"></icon>
  		</fb>
    )
	}
}
