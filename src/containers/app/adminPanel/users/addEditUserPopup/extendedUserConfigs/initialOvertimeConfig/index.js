//@flow
import React from 'react'
import moment from 'moment'
import Select from 'react-select';
import type { InitialOvertime } from 'types/index'
import './styles.css'

type Props = {
  initialOvertime: InitialOvertime,
  changeInitialOvertime: (InitialOvertime)=>any,
}

export default (props: Props) => {
  const iO = props.initialOvertime
  const year = parseInt(iO.toString().substr(0, 4), 10)
  const week = parseInt(iO.toString().substr(3, 2), 10)

  return(
    <fb className="initialOvertimeConfigMain">
      <Select
        clearable={false}
        searchable={false}
        value={year}
        options={this.getPositionsFormatted()}
        onChange={this.onPositionChanged}
      />
      <Select
        clearable={false}
        searchable={false}
        value={week}
        options={this.getPositionsFormatted()}
        onChange={this.onPositionChanged}
      />
    </fb>
  )
}
