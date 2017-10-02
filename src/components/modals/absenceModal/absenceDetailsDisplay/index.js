//@flow
import React from 'react'
import './styles.css'

type Props = {
  total: ?number,
  effective: ?number
}

export default (props: Props) => {

  return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='row total'>
        <fb className='label total'>Tage gesamt</fb>
        <fb className='count total'>{props.total}</fb>
      </fb>
      <fb className='row effective'>
        <fb className='label effective'>Tage effektiv</fb>
        <fb className='count effective'>{props.effective}</fb>
      </fb>
    </fb>
  )
}
