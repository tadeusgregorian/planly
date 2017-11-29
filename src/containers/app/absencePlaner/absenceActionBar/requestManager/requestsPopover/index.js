//@flow
import React, { PureComponent } from 'react'

import { isInsidePopover } from './localHelpers'
import { smartToMom } from 'helpers/index'

import RequestElement from './requestElement'

import type { Absence, User } from 'types/index'
import './styles.css'

type Props = {
  vacationRequests: Array<Absence>,
  users: Array<User>,
  openRequest: (Absence)=>any,
  jumpToRequest: (Absence)=>any,
  closePopover: Function,
}

export default class RequestsPopover extends PureComponent{
  props: Props

  componentDidMount    = () => document.addEventListener('click', this.clickHandler )
  componentWillUnmount = () => document.removeEventListener('click', this.clickHandler )

  clickHandler = (e:any) => {
    !isInsidePopover(e.target) && this.props.closePopover();
  }

  getUserName = (userID: string): string => {
    const user = this.props.users.find(u => u.id === userID)
    return user ? user.name : ''
  }

  getRangeStr = (a: Absence): string => {
    const startStr = smartToMom(a.startDate).format('DD MMM')
    const endStr = smartToMom(a.endDate).format('DD MMM')
    return startStr + ' - ' + endStr
  }

  render(){
    return(
      <fb className="absenceRequestsManagerPopoverMain popover_at arrowRight" data-type='vac-req-pop'>
        { this.props.vacationRequests.map(a =>
          <RequestElement
            key={a.id}
            userName={this.getUserName(a.user)}
            rangeStr={this.getRangeStr(a)}
            arrowClicked={()=>this.props.jumpToRequest(a)}
            contentClicked={()=>this.props.openRequest(a)}
          />
        )}
      </fb>
    )
  }
}
