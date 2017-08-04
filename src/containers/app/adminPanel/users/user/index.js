import React, {PureComponent} from 'react';
import './styles.css';

export default class UserElement extends PureComponent {

	render() {
		const {userClicked, user, position } = this.props
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
  		<fb className='userListItem' onClick={() => userClicked(user.id)}>
    		<fb className="color-box" style={{background: color || 'lightgrey' }}></fb>
				<fb className="item name">{name}</fb>
				<fb className="item email">
					<fb className="icon emailIcon icon-mail"></fb>
					<fb className="emailText">{email}</fb>
				</fb>
				<fb className="item position" style={{color: position.color}}>
					<fb className="icon positinIcon icon-bookmark"></fb>
					<fb className="positionText">{position.name}</fb>
				</fb>
  		</fb>
    )
	}
}
