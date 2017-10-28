//@flow

import React, { PureComponent } from 'react'

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

export default class PickLocationBox extends PureComponent {
  props: Props
  //extend: number;

  positionMe = (el: HTMLElement ) => {
    const popoverBottom = el && el.getBoundingClientRect().bottom
    const popoverRight  = el && el.getBoundingClientRect().right
    const sb  = document.getElementById('shiftBoardMain')
    const shiftBoardBottom = sb ? sb.getBoundingClientRect().bottom : 0
    const shiftBoardRight  = sb ? sb.getBoundingClientRect().right : 0
    const botExt = shiftBoardBottom - popoverBottom
    const rigExt = shiftBoardRight  - popoverRight
    if(botExt && botExt < 0) el.style.top = (botExt - 4) +  'px'
    if(rigExt && rigExt < 0) el.style.right = (shiftCellWidth - 2) + 'px'
  }

  render(){
    const { locations, closeLocationBox, pickLoc } = this.props
    const style = {
      width: shiftCellWidth - 4,
      right: -shiftCellWidth,
    }

    return(
      <fb className="pickLocationBoxMain" style={style} ref={this.positionMe}>
        <fb className='head'>
          <fb className='text'><fb className='icon icon-download dl'/>Bereich</fb>
          <fb className='icon icon-close x' onClick={closeLocationBox}/>
        </fb>
        {locations && locations.map(loc =>
          <fb
            key={loc.id}
            className='locItem'
            style={{background: loc.color}}
            onClick={()=>pickLoc(loc.id)}
            >{loc.name}</fb>
        )}
      </fb>
    )
  }
}
