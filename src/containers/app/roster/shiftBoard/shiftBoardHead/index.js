//@flow

import React from 'react'
import { weekDays, shiftCellWidth, overtimeCellWidth } from 'constants/roster'
import './styles.css'

type Props = { templateMode: boolean }

export default ({ templateMode }: Props) => {

  return(
    <fb className="shiftBoardHeadMain">
      { !templateMode && <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb> }
      <fb className='bigLeft'>Mitarbeiter</fb>
      <fb className='weekDays'>
      { weekDays.map(wd =>
          <fb key={wd} style={{width: shiftCellWidth}} className='weekDay'>
            {wd}
          </fb>
        )
      }
      </fb>
      { !templateMode && <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb> }
    </fb>
  )
}
