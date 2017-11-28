//@flow
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { logoutFromFirebase } from 'actions/auth'

import getCurrentUser from 'selectors/currentUser'
import TopbarButton from './topbarButton'
import type { User } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User
}

 const Topbar = ( { currentUser }: Props) => {

  const logoutPressed = () => { logoutFromFirebase() }
  const isAdmin = currentUser && currentUser.isAdmin

  return(
    <fb className="topbarMain">
      <fb className='centered'>
        <fb className="side left">
                       <TopbarButton label='Dienstplan'      to='/app/dienstplan'/>
                       <TopbarButton label='Abwesenheit'     to='/app/abwesenheit' />
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

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state)
})


export default withRouter(connect(mapStateToProps)(Topbar))
