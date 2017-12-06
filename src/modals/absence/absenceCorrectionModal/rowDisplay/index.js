//@flow
import React from 'react'
import cn from 'classnames'
import './styles.css'

type Props = {
  label: string,
  children: any,
  style?: {},
  grey?: boolean,
}

export default ({ label, children, style, grey }: Props) => {

  return(
    <fb className="absenceCorrectionModalDisplayRowMain" style={style}>
      <fb className={cn({label: 1, grey})}>{label}</fb>
      <fb className='content'>{children}</fb>
      <fb className='unit'>Tage</fb>
    </fb>
  )
}
