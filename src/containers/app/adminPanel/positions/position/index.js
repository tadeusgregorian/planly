import React, {PureComponent} from 'react';
import './styles.css';

export default class PositionElement extends PureComponent {

	render() {
		const {onClick, position } = this.props
		const {color, name} = position

		return(
  		<fb className='adminpanel_positionListItem' onClick={() => onClick(position)}>
    		<fb className="color-box" style={{background: color || 'lightgrey' }}></fb>
				<fb className="item name">{name}</fb>
  		</fb>
    )
	}
}
