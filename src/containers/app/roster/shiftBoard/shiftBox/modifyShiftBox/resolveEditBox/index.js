//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'

import getCurrentUser from 'selectors/currentUser'

import { unfocusShift } from 'actions/ui/roster'
import { acceptEdit, rejectEdit } from 'actions/roster'

import './styles.css'

import type { Shift, User } from 'types/index'

type Props = {
  shift: Shift,
  currentUser: User,
  unfocusShift: ()=>void
}

class ResolveEditBox extends PureComponent{
  props: Props

  close = () => this.props.unfocusShift()

  acceptClicked = () => {
    //acceptEdit(this.props.shiftEdit)
    this.close()
  }

  rejectClicked = () => {
    //rejectEdit(this.props.shiftEdit)
    this.close()
  }

  render(){
    const { currentUser } = this.props
    const { isAdmin } = currentUser
    console.log('HEREEE');

    return(
      <fb className='resolveEditBoxMain'>
        <fb className='closeButton icon icon-close' onClick={this.close}></fb>
        <fb className='shiftWrapper' key='shiftWrapper'>
          <fb className='headline'>editiert:</fb>
        </fb>
        <fb className='buttonsWrapper' key='btn1'>
          { isAdmin && <fb className='actionButton' onClick={this.acceptClicked}>übernehmen</fb> }
          <fb className='actionButton' key='btn2' onClick={this.rejectClicked}>
            { isAdmin ? 'ablehnen' : 'zurücknehmen'}
          </fb>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  unfocusShift
}

const mapStateToProps = (state) => ({
  currentUser: getCurrentUser(state)
})

export default connect(mapStateToProps, actionsToProps)(ResolveEditBox)
