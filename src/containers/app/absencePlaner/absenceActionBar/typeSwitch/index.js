//@flow
import React from 'react'
import Select from 'react-select';


//import { colorCode } from 'constants/absence'
import type { AbsenceType } from 'types/index'
import './styles.css'

type Props = {
  type: AbsenceType | 'all',
  changeType: (AbsenceType | 'all')=>void
}

export default (props: Props) => {

  const onTypeChange = (opt: any) => props.changeType(opt.value)
  const typeOptions = [
    {value: 'vac',    label: 'Urlaub'},
    {value: 'ill',    label: 'Krankheit'},
    {value: 'extra',  label: 'Sonstiges'},
    {value: 'all',    label: 'Alle'},
  ]



  return(
    <fb className='absenceTypeSwitchMain'>
      <fb className='descript'>Typ:</fb>
      <div className='typeSelect'>
        <Select
          value={props.type}
          options={typeOptions}
          onChange={onTypeChange}
          clearable={false}
          searchable={false}
        />
      </div>
    </fb>
  )
}
