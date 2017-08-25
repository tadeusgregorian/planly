import React from 'react'
import './styles.css'

export default ({closePopover}) => {

  return(
    <fb className="closeButtonMain icon icon-close" onClick={closePopover}>
    </fb>
  )
}
