import React from 'react'
import FlatInput from 'components/flatInput'
import './styles.css'

export default ({weeklyHours, onChange}) => {

  return(
    <fb className="weeklyHoursInputMain">
      <FlatInput value={weeklyHours[1]} onInputChange={onChange} defaultText='z.B. 40'/>
    </fb>
  )
}
