import React, {PureComponent} from 'react';
import './styles.css';

export default class UserElement extends PureComponent {

	render() {
		const {branchClicked, branch } = this.props
		const {color, name} = branch

		return(
  		<fb className='adminpanel_branchListItem' onClick={() => branchClicked(branch)}>
    		<fb className="color-box" style={{background: color || 'lightgrey' }}></fb>
				<fb className="item name">{name}</fb>
  		</fb>
    )
	}
}
