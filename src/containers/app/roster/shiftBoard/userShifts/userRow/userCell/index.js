//@flow
import React, { PureComponent } from 'react'
import type { User } from 'types/index'
import './styles.css'

type Props =  {
  user: User
}

export default class  extends PureComponent{
  props: Props

  render(){
    return(
      <fb className="userCellMain">
        {this.props.user.name}
      </fb>
    )
  }
}
