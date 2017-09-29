//@flow
import React from 'react'
import Select from 'react-select';

import type { Branch } from 'types/index'
//import ViewSwitch from './viewSwitch'
import { getYearsArray } from './localHelpers'
import './styles.css'

type Props = {
  currentBranch: string,
  currentYear: number,
  branches: Array<Branch>,
  changeBranch: (string)=>void,
  changeYear: (number)=>void,
  changeView: (string)=>void,
  view: string,
}

export default (props: Props) => {

  //const { view, changeView } = props
  const branchOptions = props.branches.map(b => ({value: b.id, label: b.name}))
  const onChangeBranch = (opt) => props.changeBranch(opt.value)

  const yearOptions = getYearsArray().map(y => ({value: y, label: y}))
  const onChangeYear = (opt) => props.changeYear(opt.value)

  //const viewSwitchProps = { view, changeView }

  return(
    <fb className="absenceActionBarMain">
      <fb className='absenceActionBarContent'>
        {/* <ViewSwitch { ...viewSwitchProps } /> */}
        <div className='branchSelect'>
          <Select
            value={props.currentBranch}
            options={branchOptions}
            onChange={onChangeBranch}
            clearable={false}
            searchable={false}
          />
        </div>
        <div className='yearSelect'>
          <Select
            value={props.currentYear}
            options={yearOptions}
            onChange={onChangeYear}
            clearable={false}
            searchable={false}
          />
        </div>
      </fb>
    </fb>
  )
}
