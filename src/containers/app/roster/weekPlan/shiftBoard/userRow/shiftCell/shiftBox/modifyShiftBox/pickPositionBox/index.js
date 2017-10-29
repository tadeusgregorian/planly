//flow

import React from 'react'

import { shiftCellWidth } from 'constants/roster'

import type { ShiftRef, Position } from 'types/index'
import './styles.css'

type Props = {
  shiftRef: ?ShiftRef,
  positoins: ?Array<Position>,
  pickedPos: ?string,
  pickPos: Function,
  closePositionBox: Function,
}

export default (props: Props) => {

  const style = {
    width: shiftCellWidth - 3,
    right: -1,
  }

  const { positions } = props

  return(
    <fb className="pickPositionBoxMain" style={style}>
      {/* <fb className='head'>
        <fb className='text'><fb className='icon icon-download dl'/>Bereich</fb>
        <fb className='icon icon-close x' onClick={props.closePositionBox}/>
      </fb> */}
      {positions && positions.map(pos =>
        <fb
          key={pos.id}
          className='posItem'
          style={{color: pos.color}}
          onClick={()=>props.pickPos(pos.id)}
          >
          <fb className='icon icon-account_box' />
          <fb className='text'>{pos.name}</fb>
        </fb>
      )}
    </fb>
  )
}
