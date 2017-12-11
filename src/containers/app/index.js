//@flow
import React, { PureComponent } from 'react'
import { Route, withRouter, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import Topbar from './topbar'
import Roster from './roster'
import { changeCurrentBranch } from 'actions/ui/roster'
import appDataLoaded from 'selectors/appDataLoaded'
import getCurrentUser from 'selectors/currentUser'

import AbsencePlaner  from './absencePlaner'
import AdminPanel     from './adminPanel'
import UserProfile    from './userProfile'

import type { Store } from 'types/index'
import './styles.css'


class App extends PureComponent {
  componentWillReceiveProps = (np) => {
    np.currentUser &&
    !np.currentUser.isAdmin &&
    !np.currentUser.branches[np.currentBranch] &&
    np.changeCurrentBranch(Object.keys(np.currentUser.branches)[0])
  }

  render = () => {
    const { currentUser, appDataLoaded } = this.props
    const isAdmin = currentUser && currentUser.isAdmin

    if(!appDataLoaded) return (<fb>Loading...</fb>)

    return(
      <fb className="appMain">
        <Topbar />
          <fb className="appMainContent">
            <Switch>
              <Route path='/app/dienstplan'    render={() => <Roster { ...{ currentUser }} />} />
              <Route path='/app/abwesenheit'   component={AbsencePlaner} />
              <Route path='/app/profil'        component={UserProfile} />
              <Route path='/app/einstellungen' render={() => isAdmin ? <AdminPanel { ...this.props } /> : <Redirect to='/app/dienstplan'/> } />
              <Redirect to='/app/dienstplan'/>
            </Switch>
          </fb>
      </fb>
    )
  }
}

const actionCreators = {
  changeCurrentBranch
}

const mapStateToProps = (state: Store) => ({
  appDataLoaded: appDataLoaded(state),
  currentUser: getCurrentUser(state),
  currentBranch: state.ui.roster.currentBranch,
})

export default withRouter(connect(mapStateToProps, actionCreators)(App))
