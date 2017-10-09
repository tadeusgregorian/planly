//@flow
import React from 'react'
import './styles.css'

type Props = {
  msg: 'loading' | 'overlapping' | 'multiyear'
}

export default ({msg}: Props) => {

  const getErrorText = () => {
    switch (msg) {
      case 'overlapping': return 'Zeitraum überschneidet sich mit einem anderen Abwesenheits-Eintrag.'
      case 'multiyear': return 'Abwesenheit darf nicht zwischen zwei Jahren liegen.'
      default: return ''
    }
  }

  return(
    <fb className="absenceErrorMessageMain">
      <fb className='icon alertIcon icon-warning2' />
      <fb className='text'>{getErrorText()}</fb>
    </fb>
  )
}
