//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import { shiftCellWidth } from 'constants/roster'
import { unfocusShift } from 'actions/ui/roster'
import { moveShiftTo } from 'actions/roster'

import type { PreShift, User, Day } from 'types/index'
import './styles.css'


type OwnProps = {
  shift: PreShift,
  currentUser: User,
}

type ConProps = {
  moveShiftTo: (string, string, Day)=>any,
  unfocusShift: ()=>any,
}

type Props = OwnProps & ConProps

class GrabOpenShiftBox extends PureComponent{
  props: Props

  close = () => this.props.unfocusShift()

  grabClicked = () => {
    const { id, day } = this.props.shift
    const userID = this.props.currentUser.id
    this.props.moveShiftTo(id, userID, day)
    this.close()
  }

  render(){
    return(
      <fb className='grabOpenShiftBoxMain arrow_box_pp' style={{width: shiftCellWidth - 3}}>
        <fb className='closeButton icon icon-close' onClick={this.close}></fb>
        <fb className='shiftWrapper' key='shiftWrapper'>
          <fb className='headline'>Offene Schicht</fb>
        </fb>
        <fb className='buttonsWrapper' key='btn1'>
          <fb className='actionButton accept' onClick={this.grabClicked}>
            <fb className='text'>übernehmen</fb>
          </fb>
        </fb>
      </fb>
    )
  }
}

const actionCreators= {
  unfocusShift,
  moveShiftTo,
}

const connector: Connector<OwnProps, Props> = connect(null, actionCreators)
export default connector(GrabOpenShiftBox)
