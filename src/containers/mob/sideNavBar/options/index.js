//@flow
import React from 'react'
import './styles.css'

type Props = {
  logOut: Function
}

export default (props: Props) => {

  return(
    <fb className="navBarOptionsMain">
      <fb className='logoutBtn' onClick={props.logOut}>ausloggen</fb>
    </fb>
  )
}
