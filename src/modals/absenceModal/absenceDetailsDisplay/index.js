//@flow
import React from 'react'
import './styles.css'

type Props = {
  totalDays: ?number,
  effectiveDays: ?number
}

export default (props: Props) => {

  return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='row totalDays'>
        <fb className='label totalDays'>Tage gesamt</fb>
        <fb className='count totalDays'>{props.totalDays}</fb>
      </fb>
      <fb className='row effective'>
        <fb className='label effective'>Tage effektiv</fb>
        <fb className='count effective'>{props.effectiveDays}</fb>
      </fb>
    </fb>
  )
}
