//@flow
import React from 'react'
import moment from 'moment'
import Dropdown from 'react-dropdown'
import { getRangeArray, takeYear, takeWeek, getWeeksInYear } from './localHelpers.js'
import './styles.css'

type Props = {
  smartWeek: number,
  onChange: (number)=>any,
  minSmartWeek: number,
  maxSmartWeek: number
}

export default (props: Props) => {

  const { smartWeek, onChange, minSmartWeek, maxSmartWeek } = props
  const year = takeYear(smartWeek)
  const week = takeWeek(smartWeek)
  const minYear = takeYear(minSmartWeek)
  const maxYear = takeYear(maxSmartWeek)
  const minWeek = year === minYear ? takeWeek(minSmartWeek) : 1
  const maxWeek = year === maxYear ? takeWeek(maxSmartWeek) : getWeeksInYear(year)


  const getYearOptions = () => getRangeArray(minYear, maxYear).map(y => ({ label: y, value: y }))
  const getWeekOptions = () => getRangeArray(minWeek, maxWeek).map(w => ({ label: ('KW ' + w), value: w }))

  const onWeekChange = ({value}) => onChange(parseInt(year + '' + value, 10))

  const onYearChange = ({value}) => {
    const weeksInSelectedYear = moment().year(value).weeksInYear()
    let curatedWeek =  week
    if(weeksInSelectedYear < week)          curatedWeek = weeksInSelectedYear // some years just have 52 weeks ( dont allow 53 )
    if(value === maxYear && week > maxWeek) curatedWeek = maxWeek
    if(value === minYear && week < minWeek) curatedWeek = minWeek

    onChange(parseInt(value + '' + curatedWeek, 10))
  }

  return(
    <fb className="smartWeekSelectMain">
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
    </fb>
  )
}
