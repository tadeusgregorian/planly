//@flow

import React from 'react'
import './styles.css'

type Props = {
  value: string,
  updateBreak: (string)=>void,
  toggleOptions: ()=>void
}

export default (props: Props) => {

  const isDigit = (inp: string): boolean => '1234567890'.includes(inp)
  const withoutLast = () => props.value.slice(0, -1);

  const onKeyDown = (e: SyntheticKeyboardEvent) => {
    if(e.key === 'Backspace') props.updateBreak(withoutLast())
    if(props.value.length > 2) return
    if(isDigit(e.key))        props.updateBreak(props.value + e.key)
  }

  return(
    <fb className="inputTongueMain">
      <fb className='left'>
        <fb className='label' >P</fb>
        <fb className='inputWrapper' >
          <input className='breakInput' type='text' placeholder='min' value={props.value} onKeyDown={onKeyDown} onChange={()=>''}/>
        </fb>
      </fb>
      <fb className='right' onClick={props.toggleOptions}>MEHR</fb>
    </fb>
  )
}