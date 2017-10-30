//@flow
import React from 'react'
import cn from 'classnames'

import type { Location } from 'types/index'
import './styles.css'

type Props = {
  location: string,
  locations: Array<Location>,
  removeLocation?: ()=>any,
  openLocationsBox?: ()=>any,
  editable?: boolean,
}

export default (props: Props) => {
  const { location, locations, editable, openLocationsBox, removeLocation } = props

  const contentClicked = () => openLocationsBox && openLocationsBox()
  const closeClicked = () => removeLocation && removeLocation()

  const loc: Location = (locations.find(loc => loc.id === location): any)

  const renderContent = () => (
    <fb className='wrapper'>
      <fb className='text'>{loc.name}</fb>
      {/* <fb className='icon icon-arrow_drop_down_circle locIcon' /> */}
    </fb>
  )

  return(
    <fb className={cn({locationBarMain: true, editable})} style={{ color: loc.color }}>
      { editable
        ? <fb className='wrapper' onClick={contentClicked}>{renderContent()}</fb>
        : renderContent()
      }
      { editable && <fb className='icon icon-close xBtn' onClick={closeClicked} /> }
    </fb>
  )
}
