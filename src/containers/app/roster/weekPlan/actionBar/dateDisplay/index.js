//@flow
import React, { PureComponent } from 'react'
import './styles.css'

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
