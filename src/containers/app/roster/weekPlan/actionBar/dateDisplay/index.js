//@flow
import React, { PureComponent } from 'react'
//import type Moment from 'moment'
import './styles.css'

//type propType = {mom: Moment, value: string, onClick: () => any}

export default class DateDisplay extends PureComponent{

  render(){
    const mymom = this.props.mom.format('D. MMM YYYY')
    return(
      <fb className="actionBarDateDisplayMain" onClick={this.props.onClick}>
        <fb style={{display: 'none'}}>{ this.props.value }</fb>
        <fb>{mymom}</fb>
      </fb>
    )
  }
}
