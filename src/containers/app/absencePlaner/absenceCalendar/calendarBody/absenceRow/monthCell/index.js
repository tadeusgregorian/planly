//@flow
import React, { PureComponent } from 'react'
import moment from 'moment'

import AbsenceBar from './absenceBar'
import { dayWidth } from 'constants/absence'
import type { Absence } from 'types/index'
import './styles.css'

type Props = {
  month: number,
  year: number,
  absences: Array<Absence>,
}


export default class MonthCell extends PureComponent{
  props: Props

  render(){
    const { year, month, absences } = this.props
    const width = moment().year(year).month(month).daysInMonth() * dayWidth

    return(
      <fb className="absenceMonthCell" style={{width}}>
        { absences.map(a => <AbsenceBar key={a.id} month={month} year={year} absence={a} />) }
      </fb>
    )
  }
}
