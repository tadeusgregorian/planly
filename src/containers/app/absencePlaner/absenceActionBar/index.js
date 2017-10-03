//@flow
import React, { PureComponent } from 'react'
import Select from 'react-select';

import type { Branch, AbsenceType } from 'types/index'
import TypeSwitch from './typeSwitch'
import { getYearsArray, getMonthsArray } from './localHelpers'
import './styles.css'

type Props = {
  currentBranch: string,
  currentYear: number,
  currentMonth: number,
  absenceType: ?AbsenceType,
  branches: Array<Branch>,
  changeBranch: (string)=>void,
  changeYear: (number)=>void,
  changeMonth: (number)=>void,
  changeType: (?AbsenceType)=>any,
}

export default class AbsenceActionBar extends PureComponent {
  props: Props

  onChangeBranch = (opt: any) => this.props.changeBranch(opt.value)
  onChangeYear = (opt: any) => this.props.changeYear(opt.value)
  onChangeMonth = (opt: any) => this.props.changeMonth(opt.value)

  render(){
    const { currentBranch, currentYear, currentMonth, absenceType, changeType } = this.props

    const branchOptions = this.props.branches.map(b => ({value: b.id, label: b.name}))
    const yearOptions = getYearsArray().map(y => ({value: y, label: y}))
    const monthOptions = getMonthsArray().map((y, i) => ({value: i, label: y}))

    return(
      <fb className="absenceActionBarMain">
        <fb className='absenceActionBarContent'>
          <div className='branchSelect'>
            <Select
              value={currentBranch}
              options={branchOptions}
              onChange={this.onChangeBranch}
              clearable={false}
              searchable={false}
            />
          </div>
          <div className='yearSelect'>
            <Select
              value={currentYear}
              options={yearOptions}
              onChange={this.onChangeYear}
              clearable={false}
              searchable={false}
            />
          </div>
          <div className='monthSelect'>
            <Select
              value={currentMonth}
              options={monthOptions}
              onChange={this.onChangeMonth}
              clearable={false}
              searchable={false}
            />
          </div>
          <TypeSwitch
            type={absenceType}
            changeType={changeType}
           />
        </fb>
      </fb>
    )
  }
}
