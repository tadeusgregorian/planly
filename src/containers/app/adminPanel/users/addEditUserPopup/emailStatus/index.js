import React from 'react'
import cn from 'classnames'
import './styles.css'

export default ({status, hide}) => {

  const getStatus = () => {
    switch( status ){
      case 'notInvited' : return {text: 'nicht eingeladen', icon: 'icon-error'}
      case 'invited' :    return {text: 'Einladung gesendet', icon: 'icon-markunread'}
      case 'active':      return {text: 'aktiv', icon: 'icon-checkmark2'}
      default : throw new Error ('User doesnt have a status tade...')
    }
  }

  //TODO come back and add custome classes depending on status -> and icons like warning or checked

  return(
    <fb className={cn({emailStatusMain: true, [status]: true})} style={{display: hide ? 'none' : 'flex'}}>
      <icon className={cn({icon: true, [getStatus().icon]: true})} />
      <fb>{getStatus().text}</fb>
    </fb>
  )
}
