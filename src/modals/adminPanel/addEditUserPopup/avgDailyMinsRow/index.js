//@flow
import React from 'react'
import './styles.css'

type Props = {
  avgHours: number | string,
  avgMins: number | string,
  onChange: (string, string)=>any,
}

export default ({avgHours, avgMins, onChange}: Props) => {

  return(
    <fb className='hoursPerVacDay'>
      <fb className='label'>Stunden Pro Urlaubstag</fb>
      <fb className='inpWrapper hours'>
        <input type='text' value={avgHours} onChange={(e)=>onChange('avgHours', e.target.value)} />
      </fb>
      <fb className='seperator'>std</fb>
      <fb className='inpWrapper mins'>
        <input type='text' value={avgMins} onChange={(e)=>onChange('avgMins', e.target.value)} placeholder='00'/>
      </fb>
      <fb className='seperator'>min</fb>
    </fb>
  )
}
