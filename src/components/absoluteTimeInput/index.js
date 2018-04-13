//@flow
import React from 'react'
import cn from 'classnames'
import { isIntStr } from 'helpers/index'

import './styles.css'

type Props = {
  negative: boolean,
  hours: string,
  minutes: string,
  negativeChanged: (boolean)=>any,
  hoursChanged: (string)=>any,
  minutesChanged: (string)=>any,
  noNegatives?: true,
}

export default (props: Props) => {
  const { negative, hours, minutes, negativeChanged, hoursChanged, minutesChanged, noNegatives } = props

  const onHoursChange = (e) => isIntStr(e.target.value) && hoursChanged(e.target.value)
  const onMinutesChange = (e) => isIntStr(e.target.value) && minutesChanged(e.target.value)

  return(
    <fb className='absoluteTimeInputMain'>
      { !noNegatives &&
        <fb className='minusPlusWrapper'>
          <fb className={cn({minus: 1, option: 1, selected: negative})} onClick={()=>negativeChanged(true)}>-</fb>
          <fb className={cn({plus: 1, option: 1, selected: !negative})} onClick={()=>negativeChanged(false)}>+</fb>
        </fb>
      }
      <fb className='timesWrapper'>
        <fb className='inputWrapper hours'><input type='text' value={hours} onChange={onHoursChange}/></fb>
        <fb className='unit'>Std</fb>
        <fb className='inputWrapper minutes'><input type='text' value={minutes} onChange={onMinutesChange} maxLength='2'/></fb>
        <fb className='unit'>Min</fb>
      </fb>
    </fb>
  )
}
