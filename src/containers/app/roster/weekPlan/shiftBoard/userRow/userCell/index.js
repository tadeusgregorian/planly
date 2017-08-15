//@flow
import React, { PureComponent } from 'react'
import './styles.css'

//type propType =  {user: {name: string}}

export default class  extends PureComponent{

  render(){
    return(
      <fb className="userCellMain">
        {this.props.user.name}
      </fb>
    )
  }
}
