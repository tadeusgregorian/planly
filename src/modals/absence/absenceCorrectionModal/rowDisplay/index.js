//@flow
import React from 'react'
import './styles.css'

type Props = {
  label: string,
  children: any,
  style?: {}
}

export default ({ label, children, style }: Props) => {

  return(
    <fb className="absenceCorrectionModalDisplayRowMain" style={style}>
      <fb className='label'>{label}</fb>
      <fb className='content'>{children}</fb>
      <fb className='unit'>Tage</fb>
    </fb>
  )
}
