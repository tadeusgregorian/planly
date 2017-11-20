//@flow
import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Route, BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { initFirebase } from 'actions/index'
import { setAuthStateListener, registerInitialListeners } from 'actions/listeners'
import { initIziToast } from 'helpers/iziToast'
import { onMobile } from 'helpers/index'
import ModalsManager from './modalsManager'
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
      this.props.setAuthStateListener(this.props.registerInitialListeners)
    }
  }

  render() {
    const { authState }     =  this.props
    const loggedIn 					=  authState === 'loggedIn'
    const isAuthenticating 	=  authState === 'isAuthenticating'

    if(isAuthenticating)  return (<fb>authenticating...</fb>)

    return (
      <Router>
        <fb className="Container_Main">
          <fb className='Container_Main_Inside'>
            <Switch>
              <Route path='/invite/:aID/:uID' render={(props) =>  <Invite { ...props } /> } />
              <Route path='/register'         component={Register} />
              <Route path='/login'    render={()=> !loggedIn ? <Login/>  : <Redirect to={onMobile() ? '/mob' : '/app'} />} />
              <Route path='/app'      render={()=>  loggedIn ? <App/>    : <Redirect to='/login' /> } />
              <Route path='/mob'      render={()=>  loggedIn ? <Mob/>    : <Redirect to='/login' /> } />
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

const mapStateToProps = (state) => ({
  firebaseInitialized: state.firebaseInitialized,
	firebaseAuthListener: state.firebaseListeners.firebaseAuth,
  authState: state.auth.authState,
  modals: state.ui.modals
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
