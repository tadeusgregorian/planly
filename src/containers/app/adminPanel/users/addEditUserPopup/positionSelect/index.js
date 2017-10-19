//@flow
import React from 'react'
import Select from 'react-select';
import type { Position } from 'types/index'
import './styles.css'

type Props = {
  selected: string,
  positions: Array<Position>,
  onChange: ({value: any, label: any})=>any
}

export default ({selected, positions, onChange}: Props) => {

  const getPositions = () =>
    positions.map(pos => ({ value: pos.id, label: pos.name, color: pos.color }))

  return(
    <div className="branchesSelectWrapper">
      <Select
        clearable={false}
        value={selected}
        options={getPositions()}
        optionRenderer={(opt) => (<fb style={{ color: opt.color }}>{opt.label}</fb>)}
        valueRenderer={(opt) => (<fb>{opt.label}</fb>)}
        onChange={onChange}
        searchable={false}
      />
    </div>
  )
}
