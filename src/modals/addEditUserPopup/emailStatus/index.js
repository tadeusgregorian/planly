import React from 'react'
import cn from 'classnames'
import './styles.css'

export default ({status, hide}) => {

  const getStatus = () => {
    switch( status ){
      case 'NOT_INVITED' : return {text: 'nicht eingeladen', icon: 'icon-error'}
      case 'INVITED' :     return {text: 'Einladung gesendet', icon: 'icon-markunread'}
      case 'ACTIVE':       return {text: 'aktiv', icon: 'icon-checkmark2'}
      default : throw new Error ('User doesnt have a status tade...')
    }
  }

  //TODO come back and add custome classes depending on status -> and icons like warning or checked

  return(
    <fb className={cn({emailStatusMain: true, [status]: true})} style={{display: hide ? 'none' : 'flex'}}>
      <fb className={cn({icon: true, [getStatus().icon]: true})} />
      <fb>{getStatus().text}</fb>
    </fb>
  )
}
