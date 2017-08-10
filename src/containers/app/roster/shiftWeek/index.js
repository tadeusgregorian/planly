// @flow
import React, { PureComponent } from 'react'
import ShiftBoard from './shiftBoard'
import ActionBar from './actionBar'
import './styles.css'

export default class ShiftWeek extends PureComponent{

  render(){
    return(
      <fb className="shiftWeekWrapper">
        <fb className='shiftWeekMain'>
          <ActionBar />
          <ShiftBoard />
        </fb>
      </fb>
    )
  }
}
