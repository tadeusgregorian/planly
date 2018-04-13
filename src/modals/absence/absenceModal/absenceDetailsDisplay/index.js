//@flow
import React from 'react'
import './styles.css'
import {minToTimeString} from 'helpers/roster';

type Props = {
  totalDays: ?number,
  loading: boolean,
  effectiveDays: ?number,
  adminMode: boolean,
  avgMins: number,
  openEffectiveDaysModal: Function,
  openTimeInputModal: Function,
  unpaid: true | null,
  showAvgMins?: boolean,
}

export default (props: Props) => {
  const effectiveDaysBalloon = 'Summe der Tage, an denen der Mitarbeiter gearbeitet hätte.'
  const hoursPerDayExpl = 'Stunden die dem Mitarbeiter pro Urlaubstag gutgeschrieben werden.'

  if(props.loading) return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='label'></fb>
      <fb>loading...</fb>
    </fb>
  )

  return(
    <fb className="absenceDetailsDisplayMain">
      <fb className='label'></fb>
      <fb className='col totalDays edgeRight'>
        <fb className='label totalDays'>Tage<br/>gesamt</fb>
        <fb className='count totalDays'>{props.totalDays}</fb>
      </fb>
      <fb className='col effective edgeRight marginLeft'>
        <fb className='label effective' data-balloon={effectiveDaysBalloon}>Tage<br/>effektiv</fb>
        <fb className='count effective'>{props.effectiveDays}</fb>
        { props.adminMode &&
        <fb data-balloon='Effektive Tage manuel eintragen'>
          <fb
            className='icon icon-pencil editIcon'
            onClick={props.openEffectiveDaysModal}
          />
        </fb>
        }
      </fb>
      { props.showAvgMins &&
        <fb className='col hoursPerDay marginLeft'>
          <fb className='label time' data-balloon={hoursPerDayExpl}>Stunden<br/>pro Tag</fb>
          <fb className='count'>{props.unpaid ? 0 : minToTimeString(props.avgMins, false)}</fb>
          { props.adminMode && !props.unpaid &&
          <fb data-balloon='bearbeiten'>
            <fb
              className='icon icon-pencil editIcon'
              onClick={props.openTimeInputModal}
            />
          </fb>
          }
        </fb>
      }
    </fb>
  )
}
