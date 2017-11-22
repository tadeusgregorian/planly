//@flow
import React from 'react'
import cn from 'classnames'
import type { AbsenceTypeFilter } from 'types/index'
import { colorCode } from 'constants/absence'
import './styles.css'

type Props = {
  label: string,
  type: AbsenceTypeFilter,
  onClick: (AbsenceTypeFilter)=>any,
  active: boolean,
}

export default (props: Props) => {
  const { active, onClick, label, type } = props

  return(
    <fb
      className={cn({absenceTypeBtnMain: 1 })}
      style={{color: active ? colorCode[type] : 'lightgrey' }}
      onClick={()=> onClick(type)}
      >
      {label}
    </fb>
  )
}
