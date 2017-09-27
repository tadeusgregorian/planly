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
  closeLocationBox: Function,
}

export default (props: Props) => {

  const style = {
    width: shiftCellWidth - 4,
    right: -shiftCellWidth,
  }

  const { locations } = props

  return(
    <fb className="pickLocationBoxMain" style={style}>
      <fb className='head'>
        <fb className='text'><fb className='icon icon-download dl'/>Bereich</fb>
        <fb className='icon icon-close x' onClick={props.closeLocationBox}/>
      </fb>
      {locations && locations.map(loc =>
        <fb
          key={loc.id}
          className='locItem'
          style={{background: loc.color}}
          onClick={()=>props.pickLoc(loc.id)}
          >{loc.name}</fb>
      )}
    </fb>
  )
}
