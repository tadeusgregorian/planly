import React from 'react'
import { Route } from 'react-router-dom'
import Topbar from './topbar'
import Roster from './roster'
import AdminPanel from './adminPanel'
import './styles.css'


export default () => {

  return(
    <fb className="appMain">
      <Topbar />
      <fb className="appMainContent">
        <Route path='/app/dienstplan' component={Roster} />
        <Route path='/app/einstellungen' component={AdminPanel} />
      </fb>
    </fb>
  )
}
