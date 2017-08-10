import React from 'react'
import { logoutFromFirebase } from 'actions'
import TopbarButton from './topbarButton'
import './styles.css'

export default () => {

  const logoutPressed = () => {
    logoutFromFirebase()
  }

  return(
    <fb className="topbarMain">
      <fb className='centered'>
        <fb className="side left">
          <TopbarButton label='Dienstplan'    to='/app/dienstplan'/>
          <TopbarButton label='Urlaub'        to='/app/urlaub' />
          <TopbarButton label='Einstellungen' to='/app/einstellungen' />
        </fb>
        <fb className="side right">
          <icon className="logoutIcon icon-cancel" onClick={logoutPressed} />
        </fb>
      </fb>
    </fb>
  )
}
