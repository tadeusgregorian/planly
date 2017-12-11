//@flow
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logOut } from 'actions/auth'

import getCurrentUser from 'selectors/currentUser'
import UserOptions from './userOptions'
import TopbarButton from './topbarButton'
import type { User, Store } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User,
  vacRequestsCount: number,
  shiftEditsCount: number,
  logOut: Function
}

 const Topbar = ( { currentUser, vacRequestsCount, shiftEditsCount, logOut }: Props) => {

  const logoutPressed = () => { logOut() }
  const isAdmin = currentUser && currentUser.isAdmin
  const userName = currentUser && currentUser.name

  return(
    <fb className="topbarMain">
      <fb className='centered'>
        <fb className="side left">
                       <TopbarButton label='Dienstplan'      to='/app/dienstplan'    notifications={isAdmin && shiftEditsCount}/>
                       <TopbarButton label='Abwesenheit'     to='/app/abwesenheit'   notifications={isAdmin && vacRequestsCount} />
          { isAdmin && <TopbarButton label='Einstellungen'   to='/app/einstellungen' /> }
        </fb>
        <fb className="side right">
          <UserOptions logout={logoutPressed} userName={userName} />
        </fb>
      </fb>
    </fb>
  )
}

const actionCreators = {
  logOut
}

const mapStateToProps = (state: Store) => ({
  currentUser: getCurrentUser(state),
  vacRequestsCount: state.absencePlaner.vacationRequests.length,
  shiftEditsCount: state.roster.shiftEdits.length,
})


export default withRouter(connect(mapStateToProps, actionCreators)(Topbar))
