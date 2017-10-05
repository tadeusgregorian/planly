//@flow
import React from 'react'
import moment from 'moment'
import Dropdown from 'react-dropdown'
import type { InitialOvertime } from 'types/index'
import './styles.css'

type Props = {
  initialOvertime: InitialOvertime,
  changeInitialOvertime: (InitialOvertime)=>any,
}

const getRangeArray = (first: number, last: number) => {
  const arr = []
  for( let i = first; i <= last; i++){ arr.push(i) }
  return arr
}

export default (props: Props) => {
  const iO = props.initialOvertime
  const year = parseInt(iO.smartWeek.toString().substr(0, 4), 10)
  const week = parseInt(iO.smartWeek.toString().substr(4, 2), 10)
  const nextYear = moment().year() + 3
  const weeksInYear = moment().year(year).weeksInYear()

  const getYearOptions = () => getRangeArray(2017, nextYear).map(y => ({ label: y, value: y }))
  const getWeekOptions = () => getRangeArray(1, weeksInYear).map(w => ({ label: ('KW ' + w), value: w }))

  const onInpChange = ({target}) => props.changeInitialOvertime({ ...iO, hours: target.value })
  const onWeekChange = ({value}) => {
    const smartWeek = parseInt(year + '' + value, 10)
    props.changeInitialOvertime({ ...iO, smartWeek })
  }

  const onYearChange = ({value}) => {
    const weeksInSelectedYear = moment().year(value).weeksInYear()
    const curatedWeek =  weeksInSelectedYear < week ? weeksInSelectedYear : week

    const smartWeek = value + '' + curatedWeek
    props.changeInitialOvertime({ ...iO, smartWeek })
  }

  return(
    <fb className="initialOvertimeConfigMain">
      <fb className='yearSelect selelctWrapper'>
        <Dropdown
          value={{label: year, value: year}}
          options={getYearOptions()}
          onChange={onYearChange}
        />
      </fb>
      <fb className='weekSelect selelctWrapper'>
        <Dropdown
          value={{label: ('KW ' + week), value: week}}
          options={getWeekOptions()}
          onChange={onWeekChange}
        />
    </fb>
    <fb className='spacer icon icon-arrow_forward'/>
    <fb className='overtimeInputWrapper'>
      <input type='text'  value={iO.hours} placeholder='' onChange={onInpChange} maxLength='5'/>
    </fb>
    <fb className='unit'>Std</fb>
    </fb>
  )
}
