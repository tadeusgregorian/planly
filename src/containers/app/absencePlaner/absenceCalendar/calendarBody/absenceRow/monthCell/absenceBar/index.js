//@flow
import React from 'react'

import { getPosLeft, getPosWidth } from './localHelpers'
import type { Absence } from 'types/index'
import './styles.css'

type Props = {
  month: number,
  year: number,
  absence: Absence
}

export default (props: Props) => {
  const { absence, month, year } = props
  const left = getPosLeft(absence, month)
  const width = getPosWidth(absence, year, month)
  const colorCode = {
    ill: '#4a5c65',
    vac: '#ffb625',
    extra: '#ea4e76'
  }

  const background = colorCode[absence.type]

  return(
    <fb
      className="absenceBarMain"
      style={{ left, width, background }}
      data-type='absence-bar'
      data-user={absence.user}
      data-absence-id={absence.id}>

    </fb>
  )
}
