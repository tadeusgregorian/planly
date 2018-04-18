//@flow
import React from 'react'
import './styles.css'
import {minToTimeString} from 'helpers/roster';

type Props = {
  edited: boolean,
  avgMins: number,
  adminMode: boolean,
  openTimeInputModal: Function,
}

export default (props: Props) => {
  const expl = 'Stunden die dem Mitarbeiter pro Urlaubstag gutgeschrieben werden.'

  return(
    <fb className="hoursPerDayDisplayMain">
      <fb className='label'></fb>
      <fb className='col hoursPerDay'>
        <fb className='label' data-balloon={expl}>Stunden Pro Urlaubstag</fb>
        <fb className='count'>{minToTimeString(props.avgMins, false)}</fb>
      </fb>

      { props.adminMode &&
      <fb data-balloon='bearbeiten'>
        <fb
          className='icon icon-pencil editIcon'
          onClick={props.openTimeInputModal}
        />
      </fb>
      }
    </fb>
  )
}
