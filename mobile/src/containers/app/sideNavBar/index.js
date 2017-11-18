//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import { changeCurrentBranch } from 'actions/ui/roster'
import { closeSideNav } from 'actions/ui/index'
import { logoutFromFirebase } from 'actions/auth'
import NavAnimator from './navAnimator'
import Options from './options'
import BranchPick from './branchPick'
import type { Store, SideNav, Branch } from 'types/index'
import './styles.css'

type ConProps = {
  closeSideNav: Function,
  sideNav: SideNav,
  branches: Array<Branch>,
  changeCurrentBranch: (string)=>any,
}

type Props = ConProps

class SideNavBar extends PureComponent {
  props: Props
  navAnimator: any

  componentWillReceiveProps = (nP) => {
    const { sideNav } = this.props
    const justClosed =  sideNav && !nP.sideNav
    const justOpened = !sideNav && nP.sideNav
    justClosed && this.closeIt()
    justOpened && this.openIt()
  }

  componentDidMount = () => { this.navAnimator =  new NavAnimator(
    this.props.closeSideNav
  )}

  openIt = () => {
    this.navAnimator.showSideNav()
  }

  closeIt = () => {
    this.navAnimator.hideSideNav()
  }

  render(){
    const { sideNav, closeSideNav, branches, changeCurrentBranch } = this.props
    const branchPicked = changeCurrentBranch
    const options = sideNav === 'OPTIONS'
    const branchPick = sideNav === 'BRANCH_PICK'

    return(
        <aside className="js-side-nav side-nav">
          <nav className="js-side-nav-container side-nav__container ">
            <fb className="icon icon-arrow-back closeBtn" onClick={closeSideNav} ></fb>
            <header className={'header' + (branchPick ? ' branch' : '')}>
              { options && 'Optionen' }
              { branchPick && 'Standort Wählen' }
            </header>
            { options    && <Options    {...{ logoutFromFirebase }} /> }
            { branchPick && <BranchPick {...{ branches, branchPicked }} /> }
          </nav>
        </aside>
    )
  }
}

const actionCreators = {
  closeSideNav,
  changeCurrentBranch
}

const mapStateToProps = (state: Store) => ({
  sideNav: state.ui.sideNav,
  branches: state.core.branches,
})

const connector: Connector<{}, Props> = connect(mapStateToProps, actionCreators)
export default connector(SideNavBar)
