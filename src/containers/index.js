import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom'
import { initFirebase } from 'actions'
import { setAuthStateListener } from 'actions/listeners'
import { initIziToast } from 'helpers'
import ModalsManager from 'components/unique/modalsManager'
import 'react-select/dist/react-select.css'
import Login from './login'
import Register from './register'
import App from './app'

initIziToast()

class Container extends PureComponent {
  componentWillMount = () => {
    if(!this.props.firebaseInitialized) this.props.initFirebase() // check before is a workaround for hot-reloading
    if(!this.props.firebaseAuthListener) this.props.setAuthStateListener()
  }

  render() {
    const { authState } = this.props
    const loggedIn 					=  authState === 'loggedIn'
    const isAuthenticating 	=  authState === 'isAuthenticating'

    if(isAuthenticating) return (<fb>authenticating...</fb>)

    return (
      <Router>
        <fb className="Container_Main">
          <fb className='Container_Main_Inside'>
            <Route path='/' exact   render={() => loggedIn ?  <Redirect to="/app/einstellungen" /> : <Redirect to="/login" /> } />
            <Route path='/login' 	  render={() => loggedIn ?  <Redirect to="/app/einstellungen" /> : <Login /> } />
            <Route path='/app'      render={() => loggedIn ?  <App /> : <Redirect to="/login" /> } />
            <Route path='/register' component={Register} />
          </fb>
          <ModalsManager />
        </fb>
      </Router>
    )
  }
}

const mapDispatchToProps = {
  initFirebase,
  setAuthStateListener
}

const mapStateToProps = (state) => ({
  firebaseInitialized: state.firebaseInitialized,
	firebaseAuthListener: state.firebaseListeners.firebaseAuth,
  authState: state.auth.authState,
  modals: state.ui.modals
})

export default connect(mapStateToProps, mapDispatchToProps)(Container)
