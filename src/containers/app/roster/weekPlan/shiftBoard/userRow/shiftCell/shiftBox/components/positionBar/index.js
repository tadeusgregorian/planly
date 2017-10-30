//@flow
import React from 'react'
import cn from 'classnames'

import type { Position } from 'types/index'
import './styles.css'

type Props = {
  position: string,
  positions: Array<Position>,
  openPositionBox?: ()=>any,
  editable?: boolean,
}

export default (props: Props) => {
  const { position, editable, openPositionBox } = props
  const positions = [ ...props.positions, {id: 'all', name: 'alle', color: 'grey'}] // appending a dummy position

  const contentClicked = () => openPositionBox && openPositionBox()

  const pos: Position = (positions.find(pos => pos.id === position): any)

  const renderContent = () => (
    <fb className='wrapper'>
      <fb className='icon icon-account_box posIcon' />
      <fb className='text'>{pos.name}</fb>
      { props.editable && <fb className='icon triangleIcon icon-navigate_next'/>}
    </fb>
  )

  return(
    <fb className={cn({positionBarMain: true, editable})} style={{ color: pos.color }}>
      { editable
        ? <fb className='wrapper'
          onClick={contentClicked}
          >{renderContent()}</fb>
        : renderContent()
      }
    </fb>
  )
}
