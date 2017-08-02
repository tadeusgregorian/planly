import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom'
import { initFirebase } from 'actions'
import { setAuthStateListener } from 'actions/listeners'
import { initIziToast } from 'helpers'
import Login from './login'
import Register from './register'

initIziToast()

class App extends Component {
  componentWillMount = () => {
    if(!this.props.firebaseInitialized) this.props.initFirebase() // check before is a workaround for hot-reloading
    if(!this.props.firebaseAuthListener) this.props.setAuthStateListener()
  }

  render() {
    const { authState } = this.props
    const loggedIn 					=  authState === 'loggedIn'
    const loggedOut 				= !authState || authState === 'loggedOut'
    const isAuthenticating 	=  authState === 'isAuthenticating'

    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <h2>Welcome to React Tades5678..</h2>
          </div>
          <fb style={{flexDirection: 'row'}}>
            <Route path='/login'    component={Login}/>
            <Route path='/register' component={Register} />

            <Route path='/' exact render={() => loggedIn ?  <Redirect to="/Apps/TaskManager/Kalender/Public" /> : <Redirect to="/Home" /> } />
            <Route path='/Login' 	render={() => loggedIn ?  <Redirect to="/Apps/TaskManager/Kalender/Public" /> : <Login /> } />
            <Route path='/Home'   render={() => loggedIn ?  <Redirect to="/Apps/TaskManager/Kalender/Public" /> : <Website /> } />
            <Route path='/Apps' 	render={() => loggedOut ? <Redirect to="/Login" /> : <Apps /> } />
          </fb>
        </div>
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
	firebaseAuthListener: state.firebaseListeners.firebaseAuth
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
