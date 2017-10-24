//@flow
import React from 'react'
import _ from 'lodash'
import type { Branch } from 'types/index'
import Select from 'react-select';

import './styles.css'

type Props = {
  selected: {[string]: boolean},
  branches: Array<Branch>,
  onChange: ([{value: any, label: any}])=>any
}

export default ({selected, branches, onChange}: Props) => {

  return(
    <div className="branchesSelectWrapper">
      <Select multi
        clearable={false}
        value={_.keys(selected)}
        options={branches.map(b => ({value: b.id, label: b.name}))}
        onChange={onChange}
        searchable={false}
        placeholder='Filiale wählen'
      />
    </div>
  )
}
