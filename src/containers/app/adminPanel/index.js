import React, { PureComponent } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import AdminpanelUsers from './users'
// import AdminpanelPositions from './positions'
// import AdminpanelBranches from './branches'
import './styles.css'



export default class AdminPanel extends PureComponent {

	render() {
		const baseUrl = '/einstellungen/'
		return (
			<fb className="adminpanel">
				<fb className='adminpanel-body edgebox'>
					<div className='adminpanel-navbar'>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}mitarbeiter`}>Mitarbeiter</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}positionen`}>Gruppen</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}filianen`}>Filianen</NavLink>
					</div>
					<div className='adminPanelContent'>
						<Route path="/einstellungen" exact		render={() => <Redirect to="/einstellungen/mitarbeiter" />} />
						<Route path='/einstellungen/mitarbeiter'	component={AdminpanelUsers} />
						{/* <Route path='/einstellungen/positionen' 	component={AdminpanelPositions} />
						<Route path='/einstellungen/gilianen' 		component={AdminpanelBranches} /> */}
					</div>
				</fb>
			</fb>
		)
	}
}
