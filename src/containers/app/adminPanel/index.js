// @flow

import React, { PureComponent } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import Users 			from './users'
import Positions 	from './positions'
import Branches 	from './branches'
//import Account 	from './account'
import './styles.css'

export default class AdminPanel extends PureComponent {

	render() {
		const baseUrl = '/app/einstellungen/'
		return (
			<fb className="adminpanel">
				<fb className='adminpanel-body edgebox'>
					<fb className='adminpanel-navbar'>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}mitarbeiter`}>Mitarbeiter</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}rollen`}>Rollen</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}filialen`}>Filialen</NavLink>
						{/* <NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}account`}>Account</NavLink> */}
					</fb>
					<fb className='adminPanelContent'>
						<Route path='/app/einstellungen' exact		render={() => <Redirect to="/app/einstellungen/mitarbeiter" />} />
						<Route path='/app/einstellungen/mitarbeiter'	component={Users} />
						<Route path='/app/einstellungen/filialen' 		component={Branches} />
						<Route path='/app/einstellungen/rollen' 	component={Positions} />
						{/* <Route path='/app/einstellungen/account' 			component={Account} /> */}
					</fb>
				</fb>
			</fb>
		)
	}
}
