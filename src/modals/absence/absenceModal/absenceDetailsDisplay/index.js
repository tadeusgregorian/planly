//@flow
import React from 'react'
import './styles.css'

type Props = {
  totalDays: ?number,
  loading: boolean,
  effectiveDays: ?number,
  adminMode: boolean,
  excludingSaturdays: boolean,
  openEffectiveDaysModal: Function,
}

export default (props: Props) => {
  const saturdaysText = props.excludingSaturdays ? ', Samstage' : ''
  const effectiveDaysBalloon = `ohne Feiertage${ saturdaysText } und Sonntage`

  if(props.loading) return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='label'></fb>
      <fb>loading...</fb>
    </fb>
  )

  return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='label'></fb>
      <fb className='col totalDays'>
        <fb className='label totalDays'>Tage gesamt</fb>
        <fb className='count totalDays'>{props.totalDays}</fb>
      </fb>
      <fb className='col effective'>
        <fb className='label effective' data-balloon={effectiveDaysBalloon}>Tage effektiv</fb>
        <fb className='count effective'>{props.effectiveDays}</fb>
      </fb>
      { props.adminMode &&
      <fb data-balloon='Effektive Tage manuel eintragen'>
        <fb
          className='icon icon-pencil editIcon'
          onClick={props.openEffectiveDaysModal}
        />
      </fb>
      }
    </fb>
  )
}
