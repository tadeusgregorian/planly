//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import appDataLoaded from 'selectors/appDataLoaded'
import type { Store } from 'types/index'
import Topbar from './topbar'
import SideNavBar from './sideNavBar'
import ShiftBoard from './shiftBoard'
import type { AccountPreferences } from 'types/index'
import './styles.css'

type Props = {
  appDataLoaded: boolean,
  preferences: AccountPreferences,
}

class App extends PureComponent {

  render = () => {
    if(!this.props.appDataLoaded) return (<fb>Loading...</fb>)

    return(
      <fb id="appMain">
        <Topbar  />
        <ShiftBoard />
        <SideNavBar />
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  appDataLoaded: appDataLoaded(state),
  preferences: state.core.accountDetails.preferences,
})

const connector: Connector<{}, Props> = connect(mapStateToProps)
export default connector(App)
