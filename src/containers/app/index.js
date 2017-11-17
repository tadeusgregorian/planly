//@flow
import React, { PureComponent } from 'react'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import Topbar from './topbar'
import Roster from './roster'
import AbsencePlaner from './absencePlaner'
import AdminPanel from './adminPanel'
import appDataLoaded from 'selectors/appDataLoaded'
import { openModal } from 'actions/ui/modals'
import type { Store } from 'types/index'
import './styles.css'


class App extends PureComponent {

  componentDidUpdate = (prevProps) => {
    const justLoaded = !prevProps.appDataLoaded && this.props.appDataLoaded
    justLoaded && !this.props.preferences.bundesland && this.props.openModal('BUNDESLAND')
  }

  render = () => {
    if(!this.props.appDataLoaded) return (<fb>Loading...</fb>)

    return(
      <fb className="appMain">
        <Topbar />
          <fb className="appMainContent">
            <Switch>
              <Route path='/app/dienstplan' component={Roster} />
              <Route path='/app/abwesenheit' component={AbsencePlaner} />
              <Route path='/app/einstellungen' component={AdminPanel} />
              <Route component={Roster}/>
            </Switch>
          </fb>
      </fb>
    )
  }
}


const actionCreators = {
  openModal
}

const mapStateToProps = (state: Store) => ({
  appDataLoaded: appDataLoaded(state),
  preferences: state.core.accountDetails.preferences,
})

export default withRouter(connect(mapStateToProps, actionCreators)(App))
