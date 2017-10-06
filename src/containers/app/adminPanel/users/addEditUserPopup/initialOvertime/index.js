//@flow
import React from 'react'
import moment from 'moment'
import SmartWeekSelect from 'components/smartWeekSelect'
import type { InitialOvertime } from 'types/index'
import './styles.css'

type Props = {
  initialOvertime: InitialOvertime,
  changeInitialOvertime: (InitialOvertime)=>any,
}

export default (props: Props) => {
  const iO = props.initialOvertime

  const onInpChange = ({target}) => {
    props.changeInitialOvertime({ ...iO, hours: target.value })
  }

  return(
    <fb className="initialOvertimeConfigMain">
      <fb className='descript'>Initiale Überstunden</fb>
      <SmartWeekSelect
        onChange={(smartWeek) => props.changeInitialOvertime({ ...iO, smartWeek })}
        smartWeek={iO.smartWeek}
        minSmartWeek={201701}
        maxSmartWeek={parseInt(moment().year() + 3 + '52', 10)}
      />
    <fb className='spacer icon icon-arrow_forward'/>
    <fb className='overtimeInputWrapper'>
      <input type='text'  value={iO.hours} placeholder='' onChange={onInpChange} maxLength='5'/>
    </fb>
    <fb className='unit'>Std</fb>
    </fb>
  )
}
