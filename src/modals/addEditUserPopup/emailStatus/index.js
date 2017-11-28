import React from 'react'
import cn from 'classnames'
import './styles.css'

export default ({status, hide, sendInvitation, validEmail}) => {

  const getStatus = () => {
    switch( status ){
      case 'NOT_INVITED' : return {text: 'nicht eingeladen', icon: 'icon-error'}
      case 'INVITED' :     return {text: 'eingeladen', icon: 'icon-mail'}
      case 'ACTIVE':       return {text: 'aktiv', icon: 'icon-checkmark2'}
      default : throw new Error ('User doesnt have a status tade...')
    }
  }

  const notInvited  = status === 'NOT_INVITED'
  const invited     = status === 'INVITED'
  const active      = status === 'ACTIVE'

  //TODO come back and add custome classes depending on status -> and icons like warning or checked

  return(
    <fb className='emailStatusMain' style={{display: hide ? 'none' : 'flex'}}>
      <fb className={cn({statusBar: true, [status]: true})} >
        { (active || invited) && <fb className='icon icon-checkmark2' /> }
        {  notInvited         && <fb className='icon icon-error' /> }
        <fb>{getStatus().text}</fb>
      </fb>
      { !active && validEmail &&
        <fb className='sendInvitationBtn soBtn' onClick={sendInvitation}>
          <fb className='icon icon-mail'></fb>
          <fb className='text'>{invited ? 'erneut senden' : 'einladung senden' }</fb>
        </fb>
      }
  </fb>
  )
}
