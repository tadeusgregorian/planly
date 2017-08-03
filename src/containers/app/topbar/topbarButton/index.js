import React from 'react'
import { NavLink } from 'react-router-dom'
import './styles.css'

export default ({label, onClick, to}) => {

  return(
    <NavLink to={to}>
      <fb className="topbarButton">
        {label}
      </fb>
    </NavLink>
  )
}
