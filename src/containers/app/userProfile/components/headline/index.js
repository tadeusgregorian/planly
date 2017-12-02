//@flow
import React from 'react'
import './styles.css'

type Props = {
  title: string
}

export default ({title}: Props) => {

  return(
    <fb className="userProfileHeadlineMain">
      {title}
    </fb>
  )
}
