//@flow
import React from 'react'
import './styles.css'

type Props = {
  totalDays: ?number,
  effectiveDays: ?number,
  openEffectiveDaysModal: Function,
}

export default (props: Props) => {

  return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='label'></fb>
      <fb className='col totalDays'>
        <fb className='label totalDays'>Tage gesamt</fb>
        <fb className='count totalDays'>{props.totalDays}</fb>
      </fb>
      <fb className='col effective'>
        <fb className='label effective'>Tage effektiv</fb>
        <fb className='count effective'>{props.effectiveDays}</fb>
      </fb>
      <fb data-balloon='Effektive Tage manuel eintragen'>
        <fb
          className='icon icon-pencil editIcon'
          onClick={props.openEffectiveDaysModal}
        />
      </fb>
    </fb>
  )
}
