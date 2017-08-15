//@flow

import React from 'react'
import { minToTimeString } from 'helpers/index'
import './styles.css'

type props = {
  startTime: string,
  endTime: string,
  getStartTimeRef: (HTMLInputElement)=>void,
  getEndTimeRef: (HTMLInputElement)=>void,
  startTimeChanged: (SyntheticInputEvent)=>void,
  endTimeChanged: (SyntheticInputEvent)=>void,
  focusStartTime: ()=>void,
  focusEndTime: ()=>void,
  height: number
}

export default (props: props) => {

  const onKeyDownOnEndTime = (e: SyntheticKeyboardEvent) => {
    const inputEmpty = props.endTime.length === 0
    const wannaJumpLeft = e.key === 'Backspace' || e.key === 'ArrowLeft'
    if(inputEmpty && wannaJumpLeft) {
      e.preventDefault()
      props.focusStartTime()
    }
  }

  const onKeyDownOnStartTime = (e: SyntheticKeyboardEvent) => {
    if(props.endTime.length === 0 && e.key === 'ArrowRight'){
      e.preventDefault()
      props.focusEndTime()
    }
  }


  return(
    <fb className="inputWindowMain" style={{height: props.height + 2 }}>
      <fb className='inpWrapper'>
        <input
          className="timeInput start"
          type="text"
          value={props.startTime}
          onChange={props.startTimeChanged}
          ref={props.getStartTimeRef}
          onKeyDown={onKeyDownOnStartTime}
          maxLength="5"
          autoFocus
          placeholder={minToTimeString(0)}
        />
      </fb>
      <fb className='seperator' style={{width: 14}}> - </fb>
      <fb className='inpWrapper'>
        <input
          value={props.endTime}
          onChange={props.endTimeChanged}
          className="timeInput end"
          type="text"
          placeholder={minToTimeString(0)}
          maxLength="5"
          onKeyDown={onKeyDownOnEndTime}
          ref={props.getEndTimeRef}
           />
       </fb>
    </fb>
  )
}
