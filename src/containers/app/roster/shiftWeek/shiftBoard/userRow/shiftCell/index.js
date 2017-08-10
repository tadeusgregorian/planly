//@flow
import React, { PureComponent } from 'react'
import { shiftCellWidth } from 'constants/roster'
import './styles.css'

//type propType =  {user: {name: string}}

export default class  extends PureComponent{

  render(){
    return(
      <fb className="shiftCellMain" style={{width: shiftCellWidth}} >
        12:40 - 19:00
      </fb>
    )
  }
}
