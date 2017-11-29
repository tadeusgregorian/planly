//@flow
import React from 'react'
import { minToTimeString } from 'helpers/index'
import './styles.css'

type Props = {
  startTime: string,
  endTime: string,
  breakMinutes: string,
  getStartTimeRef: (HTMLInputElement)=>void,
  getEndTimeRef: (HTMLInputElement)=>void,
  getBreakRef: (HTMLInputElement)=>void,
  startTimeChanged: (SyntheticInputEvent)=>void,
  endTimeChanged: (SyntheticInputEvent)=>void,
  breakChanged: (SyntheticInputEvent)=>void,
  focusStartTime: ()=>void,
  focusEndTime: ()=>void,
}

export default (props: Props) => {

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

  const onKeyDownOnBreak = (e: SyntheticKeyboardEvent) => {
    const inputEmpty = props.breakMinutes.length === 0
    const wannaJumpLeft = e.key === 'Backspace' || e.key === 'ArrowLeft'
    if(inputEmpty && wannaJumpLeft) {
      e.preventDefault()
      props.focusEndTime()
    }
  }

  const onFocus = ({target}) => {
    target.selectionStart = target.selectionEnd = target.value.length
  }

  return(
    <fb className="inputWindowMain">
      <fb className='startEndTimeWrapper'>
        <fb className='inpWrapper startEnd'>
          <input
            className="timeInput start"
            type="text"
            value={props.startTime}
            onChange={props.startTimeChanged}
            ref={props.getStartTimeRef}
            onKeyDown={onKeyDownOnStartTime}
            onFocus={onFocus}
            maxLength="5"
            autoFocus
            placeholder={minToTimeString(0)}
          />
        </fb>
        <fb className='seperator'></fb>
        <fb className='inpWrapper startEnd'>
          <input
            className="timeInput end"
            type="text"
            value={props.endTime}
            onChange={props.endTimeChanged}
            onFocus={onFocus}
            placeholder={minToTimeString(0)}
            maxLength="5"
            onKeyDown={onKeyDownOnEndTime}
            ref={props.getEndTimeRef}
          />
        </fb>
      </fb>
      <fb className='inpWrapper break'>
          <input
            value={props.breakMinutes}
            onChange={props.breakChanged}
            className="timeInput break"
            type="text"
            placeholder='min'
            maxLength="3"
            onKeyDown={onKeyDownOnBreak}
            ref={props.getBreakRef}
          />
        </fb>
    </fb>
  )
}
