//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import getCurrentUser from 'selectors/currentUser'
import { shiftCellWidth } from 'constants/roster'

import { unfocusShift } from 'actions/ui/roster'
import { acceptEdit, rejectEdit } from 'actions/roster'

import './styles.css'

import type { Shift, User, Store } from 'types/index'

type OwnProps = {
  shift: Shift
}

type ConProps = {
  currentUser: User,
  acceptEdit: (Shift)=>any,
  rejectEdit: (Shift)=>any,
  unfocusShift: ()=>any,
}

type Props = OwnProps & ConProps

class ResolveEditBox extends PureComponent{
  props: Props

  close = () => this.props.unfocusShift()

  acceptClicked = () => {
    this.props.acceptEdit(this.props.shift)
    this.close()
  }

  rejectClicked = () => {
    this.props.rejectEdit(this.props.shift)
    this.close()
  }

  render(){
    const { currentUser } = this.props
    const { isAdmin } = currentUser

    return(
      <fb className='resolveEditBoxMain arrow_box_pp' style={{width: shiftCellWidth - 3}}>
        <fb className='closeButton icon icon-close' onClick={this.close}></fb>
        <fb className='shiftWrapper' key='shiftWrapper'>
          <fb className='headline'>editiert</fb>
        </fb>
        <fb className='buttonsWrapper' key='btn1'>
          { isAdmin && <fb className='actionButton' onClick={this.acceptClicked}>
            <fb className='icon icon-checkmark doneIcon' />
            übernehmen
          </fb> }
          <fb className='actionButton reject' key='btn2' onClick={this.rejectClicked}>
            <fb className='icon icon-cross crossIcon' />
            { isAdmin ? 'ablehnen' : 'zurücknehmen'}
          </fb>
        </fb>
      </fb>
    )
  }
}

const actionCreators= {
  unfocusShift,
  acceptEdit,
  rejectEdit
}

const mapStateToProps = (state: Store) => ({
  currentUser: getCurrentUser(state)
})

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, actionCreators)
export default connector(ResolveEditBox)
