import React, {PureComponent} from 'react';
import './styles.css';

export default class UserElement extends PureComponent {

	render() {
		const { branchClicked, branch } = this.props
		const { name } = branch

		return(
  		<fb className='adminpanel_branchListItem' onClick={() => branchClicked(branch)}>
    		<fb className="icon icon-location2"></fb>
				<fb className="item name">{name}</fb>
  		</fb>
    )
	}
}
