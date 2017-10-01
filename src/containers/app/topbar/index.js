//@flow
import React from 'react'
import { connect } from 'react-redux'
import { logoutFromFirebase } from 'actions/auth'

import getCurrentUser from 'selectors/currentUser'
import TopbarButton from './topbarButton'
import type { User } from 'types/index'
import './styles.css'

type Props = {
  currentUser: User
}

 const Topbar = (props:Props) => {

  const logoutPressed = () => {
    logoutFromFirebase()
  }

  return(
    <fb className="topbarMain">
      <fb className='centered'>
        <fb className="side left">
          <TopbarButton label='Dienstplan'      to='/app/dienstplan/wochenplan'/>
          <TopbarButton label='Abwesenheit'     to='/app/abwesenheit' />
          <TopbarButton label='Einstellungen'   to='/app/einstellungen' />
        </fb>
        <fb className="side right">
          <fb className='userName'>{props.currentUser && props.currentUser.name}</fb>
          <fb className="icon logoutIcon icon-cancel" onClick={logoutPressed} />
        </fb>
      </fb>
    </fb>
  )
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state)
})


export default connect(mapStateToProps)(Topbar)
