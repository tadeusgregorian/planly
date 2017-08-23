// import React, { PureComponent} from 'react'
//
// export default class MY extends PureComponent {
//   render(){
//     return(<fb>Dicksonsser2244488</fb>)
//   }
// }

import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom'
import { initFirebase } from 'actions'
import { setAuthStateListener, registerInitialListeners } from 'actions/listeners'
import { initIziToast } from 'helpers'
import ModalsManager from 'components/unique/modalsManager'
import moment from 'moment'
import 'moment/locale/de'
import 'react-select/dist/react-select.css'
import Login from './login'
import Register from './register'
import App from './app'

initIziToast()
moment.locale('de')

class Container extends PureComponent {
  componentWillMount = () => {
    if(!this.props.firebaseInitialized) this.props.initFirebase() // check before is a workaround for hot-reloading
    if(!this.props.firebaseAuthListener) this.props.setAuthStateListener()
      .then((user) => {this.props.registerInitialListeners()})
      .catch()
  }

  render() {
    const { authState } = this.props
    const loggedIn 					=  authState === 'loggedIn'
    const isAuthenticating 	=  authState === 'isAuthenticating'

    if(isAuthenticating) return (<fb>authenticating...</fb>)

    return (
      <Router>
        <fb className="Container_Main">
          <fb>coolBeanse</fb>
          <fb className='Container_Main_Inside'>
            <Route path='/' exact   render={() => loggedIn ?  <Redirect to="/app/dienstplan" /> : <Redirect to="/login" /> } />
            <Route path='/login' 	  render={() => loggedIn ?  <Redirect to="/app/dienstplan" /> : <Login /> } />
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
