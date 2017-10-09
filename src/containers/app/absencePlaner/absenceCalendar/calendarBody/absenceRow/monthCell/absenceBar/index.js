//@flow
import React from 'react'
import cn from 'classnames'

import { colorCode } from 'constants/absence'
import { smartToMom } from 'helpers/index'
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

  const backgroundColor = colorCode[absence.type]
  const extendsLeft = smartToMom(absence.startDate).month() < month
  const extendsRight = smartToMom(absence.endDate).month() > month

  const getStartEndShort = () => {
    const start = smartToMom(absence.startDate).format('DD MMM')
    const end = smartToMom(absence.endDate).format('DD MMM')
    return start + ' - ' + end
  }

  return(
    <fb
      className={cn({absenceBarMain: true, requested: absence.status === 'requested'})}
      style={{ left, width, backgroundColor }}
      data-type='absence-bar'
      data-user={absence.user}
      data-absence-id={absence.id}
    >
      { extendsLeft && <fb className='arrowIndicator icon icon-arrow_back' />}
      <fb className='content'>{ width > 60 && getStartEndShort()}</fb>
      { extendsRight && <fb className='arrowIndicator icon icon-arrow_forward' />}
    </fb>
  )
}
