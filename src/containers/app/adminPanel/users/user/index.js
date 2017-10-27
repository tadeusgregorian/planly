import React, {PureComponent} from 'react';
import './styles.css';

export default class UserElement extends PureComponent {

	render() {
		const {userClicked, user, position } = this.props
		const {deleted, name} = user

		if(deleted) {
			return (
				<fb className='adminPanelUserItem deleted'>
					<fb className="userName">{name}</fb>
				</fb>
			)
		}

		return(
  		<fb id='adminPanelUserItem' onClick={() => userClicked(user)}>
				<fb className="item name">{name}</fb>
				<fb className="item position" style={{color: position.color}}>
					<fb className="icon positinIcon icon-bookmark"></fb>
					<fb className="positionText">{position.name}</fb>
				</fb>
  		</fb>
    )
	}
}
