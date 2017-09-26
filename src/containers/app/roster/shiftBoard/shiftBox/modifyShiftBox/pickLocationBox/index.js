//flow

import React from 'react'

import { shiftCellWidth } from 'constants/roster'

import type { ShiftRef, Location } from 'types/index'
import './styles.css'

type Props = {
  shiftRef: ?ShiftRef,
  locations: ?Array<Location>,
  pickedLoc: ?string,
  pickLoc: Function,
}

export default (props: Props) => {

  const style = {
    width: shiftCellWidth - 4,
    right: -shiftCellWidth,
  }

  const { locations } = props

  return(
    <fb className="pickLocationBoxMain" style={style}>
      {locations && locations.map(loc =>
        <fb key={loc.id} className='locItem'>{loc.name}</fb>
      )}
    </fb>
  )
}
