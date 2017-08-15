import React from 'react'
import './styles.css'

type Props = {
  breakMinutes: string,
  updateBreak: (string)=>void
}

export default (props: Props) => {

  return(
    <fb className="breakInputMain">
      <fb className='label' >Pause</fb>
      <fb className='inputWrapper' >
        <input className='breakInput' type='text' placeholder='min' value='' />
      </fb>
    </fb>
  )
}
