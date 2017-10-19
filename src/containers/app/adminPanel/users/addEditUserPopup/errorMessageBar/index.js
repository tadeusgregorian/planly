//@flow
import React from 'react'
import './styles.css'

type Props = {
  errorText: ?string,
}

export default ({errorText}: Props) => {

  return(
    <fb className="errorText" style={{display: errorText ? 'flex' : 'none' }}>
      <fb className='icon icon-error_outline' />
      <fb className='text'>{errorText}</fb>
    </fb>
  )
}
