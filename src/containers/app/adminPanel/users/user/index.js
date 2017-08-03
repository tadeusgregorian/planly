import React, {PureComponent} from 'react';
import './styles.css';

export default class UserElement extends PureComponent {

	render() {
		const {editUser, user } = this.props
		const {deleted, color, name, email} = user

		if(deleted) {
			return (
				<fb className='userListItem deleted'>
					<fb className="color-box" style={{backgroundColor: 'lightgrey' }}></fb>
					<fb className="userName">{name}</fb>
				</fb>
			)
		}

		return(
  		<fb className='userListItem'>
    		<fb className="color-box" style={{background: color || 'lightgrey' }}></fb>
				<fb className="userName">{name}</fb>
				<fb className="userName">{email}</fb>
				<button className="editUserButton" onClick={() => { editUser(true, user)}}>bearbeiten</button>
  		</fb>
    )
	}
}
