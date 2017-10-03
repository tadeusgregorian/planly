//@flow
import React from 'react'

import { colorCode } from 'constants/absence'
import { smartToMom } from 'helpers/general'
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

  const background = colorCode['vac']
  const extendsLeft = smartToMom(absence.startDate).month() < month
  const extendsRight = smartToMom(absence.endDate).month() > month

  return(
    <fb
      className="absenceBarMain"
      style={{ left, width, background }}
      data-type='absence-bar'
      data-user={absence.user}
      data-absence-id={absence.id}
    >
      { extendsLeft && <fb className='arrowIndicator icon icon-arrow_back' />}
      <fb className='content'></fb>
      { extendsRight && <fb className='arrowIndicator icon icon-arrow_forward' />}
    </fb>
  )
}
