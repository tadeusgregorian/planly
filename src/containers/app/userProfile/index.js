// @flow

import React, { PureComponent } from 'react'
import { NavLink, Route } from 'react-router-dom'
import { Redirect } from 'react-router'
import EmailEdit 			from './emailEdit'
import PasswordEdit 	from './passwordEdit'

import './styles.css'

export default class UserProfile extends PureComponent {

	render() {
		const baseUrl = '/app/profil/'
		return (
			<fb className="userProfileMain">
				<fb className='userProfile-body edgebox'>
					<fb className='userProfile-navbar'>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}email`}>Email Ändern</NavLink>
						<NavLink activeClassName="selected" className="navbar-item" to={`${baseUrl}passwort`}>Passowrt Ändern</NavLink>
					</fb>
					<fb className='userProfileContent'>
						<Route path='/app/profil' exact		render={() => <Redirect to="/app/profil/email" />} />
						<Route path='/app/profil/email'	      component={EmailEdit} />
						<Route path='/app/profil/passwort' 		component={PasswordEdit} />
					</fb>
				</fb>
			</fb>
		)
	}
}
