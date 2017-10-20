//@flow

import React from 'react'
import { weekDays, shiftCellWidth, overtimeCellWidth } from 'constants/roster'
import './styles.css'

export default () => {

  return(
    <fb className="shiftBoardHeadMain">
      <fb className='oTime' style={{width: overtimeCellWidth}}>&sum;</fb>
      <fb className='bigLeft'>Mitarbeiter</fb>
      { weekDays.map(wd =>
          <fb key={wd} style={{width: shiftCellWidth}} className='weekDay'>
            {wd}
          </fb>
        )
      }
    </fb>
  )
}
