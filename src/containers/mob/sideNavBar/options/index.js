//@flow
import React from 'react'
import './styles.css'

type Props = {
  logoutFromFirebase: Function
}

export default (props: Props) => {

  return(
    <fb className="navBarOptionsMain">
      <fb className='logoutBtn' onClick={props.logoutFromFirebase}>ausloggen</fb>
    </fb>
  )
}
