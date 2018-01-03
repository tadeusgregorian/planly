//@flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
//import { generateGuid } from 'helpers/index'
import { initFirebase } from 'actions/index'
import { setAuthStateListener } from 'actions/listeners/auth'
import { registerInitialListeners } from 'actions/listeners/init'
import { initIziToast } from 'helpers/iziToast'
import { onMobile } from 'helpers/index'
import ModalsManager from './modalsManager'
import type { Store } from 'types/index'

import 'react-select/dist/react-select.css'
import 'react-dates/initialize' // needs to be here for an airBnB bug fix
import 'react-dates/lib/css/_datepicker.css';

import Login    from './login'
import Register from './register'
import Invite   from './invite'
import App      from './app'
import Mob      from './mob'

initIziToast()

class Container extends PureComponent {
  componentDidMount = () => {

    if(!this.props.firebaseInitialized) this.props.initFirebase() // making sure we initialize Firebase only once...
    if(!this.props.firebaseAuthListener){
      if(this.props.dbVersion === 'maintenance') return // under construction -> dont attach listeners!
      this.props.setAuthStateListener(this.props.registerInitialListeners)
    }
  }

  componentWillReceiveProps = (np) => {
    const { dbVersion } = this.props // if dbVersions was loaded and now changed -> reload!
    dbVersion && np.dbVersion && dbVersion !== np.dbVersion && window.location.reload();
  }

  render() {
    const { authState, dbVersion }     = this.props
    const loggedIn 					    = authState === 'loggedIn'
    const isAuthenticating 	        = authState === 'isAuthenticating'
    const underConstruciton         = dbVersion === 'maintenance'

    if(isAuthenticating)  return (<fb>authenticating...</fb>)
    if(underConstruciton) return (<fb>Running Updates. We will be back soon.</fb>)

    return (
      <Router>
        <fb className="Container_Main">
          <fb className='Container_Main_Inside'>
            <Switch>
              <Route path='/invite/:accID/:inviteID'  render={(props) =>  <Invite { ...props } /> } />
              <Route path='/register'                 component={Register} />
              <Route path='/login'     render={()=> !loggedIn ? <Login/>  : <Redirect to={onMobile() ? '/mob' : '/app'} />} />
              <Route path='/app'       render={()=>  loggedIn ? <App/>    : <Redirect to='/login' /> } />
              <Route path='/mob'       render={()=>  loggedIn ? <Mob/>    : <Redirect to='/login' /> } />
              <Redirect to='/login' />
            </Switch>
          </fb>
          <ModalsManager />
        </fb>
      </Router>
    )
  }
}

const mapDispatchToProps = {
  initFirebase,
  setAuthStateListener,
  registerInitialListeners
}

const mapStateToProps = (state: Store) => ({
  firebaseInitialized: state.firebaseInitialized,
	firebaseAuthListener: state.firebaseListeners.firebaseAuth,
  authState: state.auth.authState,
  dbVersion: state.dbVersion,
  modals: state.ui.modals
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
