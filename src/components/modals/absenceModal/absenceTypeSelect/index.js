//@flow
import React from 'react'
import cn from 'classnames'

import type { AbsenceType } from 'types/index'
import './styles.css'

type Props = {
  selectedType: ?string,
  selectType: (AbsenceType)=>void
}

export default (props: Props) => {

  const selectedIll = () => props.selectType('ill')
  const selectedVac = () => props.selectType('vac')
  const selectedExt = () => props.selectType('extra')

  const { selectedType } = props

  return(
    <fb className="absenceTypeSelectMain">
      <fb className={cn({opt: true, selected: selectedType === 'ill'})} onClick={selectedIll}>Krankheit</fb>
      <fb className={cn({opt: true, selected: selectedType === 'vac'})} onClick={selectedVac}>Urlaub</fb>
      <fb className={cn({opt: true, selected: selectedType === 'extra'})} onClick={selectedExt}>Sonstiges</fb>
    </fb>
  )
}
