//@flow
import React from 'react'

import type { Position } from 'types/index'
import './styles.css'

type Props = {
  selectedPos: string,
  selectPos: (string)=>void,
  positions: Array<Position>
}

export default ({selectPos, selectedPos, positions}: Props) => {

  return(
    <fb className="positionsBubbleMain">
      { positions.map(pos => {
        const selectIcon = pos.id === selectedPos ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked'
        return (
        <fb key={pos.id} className='posOption' style={{color: pos.color}} onClick={() => selectPos(pos.id)}>
          <fb className='checkbox'>
            <icon className={selectIcon} />
          </fb>
          <fb className='posName'>{pos.name}</fb>
        </fb>
      )})}
    </fb>
  )
}
