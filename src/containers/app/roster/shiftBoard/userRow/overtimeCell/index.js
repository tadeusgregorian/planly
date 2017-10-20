//@flow
import React from 'react'
import { overtimeCellWidth } from 'constants/roster'
import type { Correction } from 'types/index'
import './styles.css'

type Props = {
  overtime: ?number,
  correction: ?Correction,
  userID: string,
}

export default ({overtime, userID, correction}: Props) => {

  const roundUp = (num) => Math.round((num / 60) * 10) / 10
  const withPlus = (num) => num < 0 ? num.toString() : '+ ' + num

  const overtimeExists = typeof overtime === 'number' // cant just do a falsy check -> 0 turns into false
  const overtimeFormated = overtimeExists && overtime && withPlus(roundUp(overtime)) + ' h'
  const correctionFormated = correction &&  withPlus(roundUp(correction.mins)) + ' h'

  return(
    <fb className="overtimeCellMain" style={{width: overtimeCellWidth}} data-type='otime-box' data-user={userID} data-status={'inactive'}>
      <fb className='overtimeWrapper'>{ overtimeExists ? overtimeFormated : <fb className='icon icon-question questionMark' /> }</fb>
      { correction
        &&
        <fb className='correctionBox'>
          <fb className='icon icon-av_timer timerIcon'/>
          <fb className='text'>{correctionFormated}</fb>
        </fb>
      }
    </fb>
  )
}
