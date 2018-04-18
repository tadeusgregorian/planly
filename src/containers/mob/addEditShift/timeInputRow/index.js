import React from 'react'
import TimeInput from './timeInput'
import BreakInput from './breakInput'

import './styles.css'

export default ({
  startTime,
  endTime,
  breakMinutes,
  setStartTime,
  setEndTime,
  setBreakMinutes
}) => {

  return (
    <fb className="row big timeRowMobMain">
      <fb className="startTimeWrapper inpWrapper">
        <TimeInput time={startTime} onTimeChange={setStartTime} label='VON'/>
      </fb>
      <fb className="endTimeWrapper inpWrapper">
        <TimeInput time={endTime} onTimeChange={setEndTime} label='BIS'/>
      </fb>
      <fb className="breakWrapper inpWrapper">
        <BreakInput value={breakMinutes} onChange={setBreakMinutes} label='PAUSE' />
      </fb>
    </fb>
  )
}
