//@flow
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logoutFromFirebase } from 'actions/auth'

import getCurrentUser from 'selectors/currentUser'
import TopbarButton from './topbarButton'
import type { User, Store } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User,
  vacRequestsCount: number,
  shiftEditsCount: number,
}

 const Topbar = ( { currentUser, vacRequestsCount, shiftEditsCount }: Props) => {

  const logoutPressed = () => { logoutFromFirebase() }
  const isAdmin = currentUser && currentUser.isAdmin

  return(
    <fb className="topbarMain">
      <fb className='centered'>
        <fb className="side left">
                       <TopbarButton label='Dienstplan'      to='/app/dienstplan'    notifications={shiftEditsCount}/>
                       <TopbarButton label='Abwesenheit'     to='/app/abwesenheit'   notifications={vacRequestsCount} />
          { isAdmin && <TopbarButton label='Einstellungen'   to='/app/einstellungen' /> }
        </fb>
        <fb className="side right">
          <fb className='userName'>{currentUser && currentUser.name}</fb>
          <fb className="icon logoutIcon icon-arrow-right2" onClick={logoutPressed} />
        </fb>
      </fb>
    </fb>
  )
}

const mapStateToProps = (state: Store) => ({
  currentUser: getCurrentUser(state),
  vacRequestsCount: state.absencePlaner.vacationRequests.length,
  shiftEditsCount: state.roster.shiftEdits.length,
})


export default withRouter(connect(mapStateToProps)(Topbar))
