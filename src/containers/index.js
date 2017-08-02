import React, { Component } from 'react';
import { connect } from 'react-redux'
import Login from './login'
import { initFirebase } from 'actions/init'
import { initIziToast } from 'helpers'

initIziToast()

class App extends Component {
  componentWillMount = () => {
    if(!this.props.firebaseInitialized) this.props.initFirebase()
  }

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React Tades5678..</h2>
        </div>
        <Login />
      </div>
    )
  }
}

const mapDispatchToProps = { initFirebase }

const mapStateToProps = (state) => ({
  firebaseInitialized: state.firebaseInitialized
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
