//@flow
import React from 'react'
import './styles.css'

type Props = {
  leave: ActionCreator
}

export default (props: Props) => {

  return(
    <fb className="actionBarextraHoursBarMain">
      <fb className='icon icon-timer timerIcon' />
      <fb className='text'>Extrastunde vergeben</fb>
      <fb className='btn' onClick={props.leave} >abbrechen</fb>
    </fb>
  )
}
