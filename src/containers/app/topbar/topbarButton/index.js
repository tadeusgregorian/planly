import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.css'

export default ({label, onClick, to}) => {

  return(
    <NavLink to={to} className='navlink'>
      <fb className="topbarButton">
        {label}
      </fb>
    </NavLink>
  )
}
