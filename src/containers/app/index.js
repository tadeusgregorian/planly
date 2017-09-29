import React, { PureComponent } from 'react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Topbar from './topbar'
import Roster from './roster'
import Absence from './absence'
import AdminPanel from './adminPanel'
import appDataLoaded from 'selectors/appDataLoaded'
import './styles.css'


class App extends PureComponent {

  render = () => {
    if(!this.props.appDataLoaded) return (<fb>Loading...</fb>)

    return(
      <fb className="appMain">
        <Topbar />
        <fb className="appMainContent">
          <Route path='/app/dienstplan' component={Roster} />
          <Route path='/app/abwesenheit' component={Absence} />
          <Route path='/app/einstellungen' component={AdminPanel} />
        </fb>
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  appDataLoaded: appDataLoaded(state)
})

export default withRouter(connect(mapStateToProps)(App))
