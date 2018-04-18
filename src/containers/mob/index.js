//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import appDataLoaded from 'selectors/appDataLoaded'
import type { Store } from 'types/index'
import TopbarMobile from './topbarMobile'
import SideNavBar from './sideNavBar'
import ShiftBoardMobile from './shiftBoardMobile'
import OptionsPanel from './optionsPanel'
import AddEditShift from './addEditShift'
import type { AccountPreferences } from 'types/index'
import './styles.css'

type Props = {
  appDataLoaded: boolean,
  preferences: AccountPreferences,
  setClientToMobile: Function
}

class Mob extends PureComponent {

  componentDidMount = () => {
    window.$crisp.push(['do', 'chat:hide']);
    this.props.setClientToMobile()
  }

  renderMain = () => (
    <fb className="mobileWrapperMain">
      <TopbarMobile  />
      <ShiftBoardMobile />
      <SideNavBar />
    </fb>
  )

  render = () => {
    if(!this.props.appDataLoaded) return (<fb>Loading...</fb>)

    return(
      <fb id="appMain">
        <Switch>
          <Route path='/mob/shiftBoard' render={() => this.renderMain() } />
          <Route path='/mob/addEditShift/:shiftID' component={AddEditShift} />
          <Redirect to='/mob/shiftBoard'/>
        </Switch>
        <OptionsPanel />
      </fb>
    )
  }
}

const actionCreators = {
  setClientToMobile: () => ({ type: 'SET_CLIENT_TO_MOBILE' })
}

const mapStateToProps = (state: Store) => ({
  appDataLoaded: appDataLoaded(state),
  preferences: state.core.accountDetails.preferences,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default withRouter(connector(Mob))
