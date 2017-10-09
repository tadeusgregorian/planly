//@flow
import React from 'react'
import './styles.css'

type Props = {
  onClick: Function
}

export default ({onClick}: Props) => {

  return(
    <fb className="requestVacBtnMain soBtn" onClick={onClick}>
      + Urlaubsantrag
    </fb>
  )
}
