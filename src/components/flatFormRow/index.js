import React from 'react'
import './styles.css'

export default ({label, children}) => {

  return(
    <fb className="flatFormRowMain">
      <fb className="label">{label}</fb>
      <fb className="inputWrapper">
        {children}
      </fb>
    </fb>
  )
}
