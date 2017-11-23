//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import cn from 'classnames'

import { shiftCellWidth } from 'constants/roster'

import { unfocusShift } from 'actions/ui/roster'
import { acceptEdit, rejectEdit } from 'actions/roster'

import ShiftEditBar from '../../components/shiftEditBar'
import './styles.css'

import type { PreShift, User } from 'types/index'

type OwnProps = {
  shift: PreShift,
  currentUser: User,
}

type ConProps = {
  acceptEdit: (PreShift)=>any,
  rejectEdit: (PreShift)=>any,
  unfocusShift: ()=>any,
}

type Props = OwnProps & ConProps

class ResolveEditBox extends PureComponent{
  props: Props
  state = { fadeIn: false}

  componentDidMount =  () => { setTimeout(()=>this.setState({ fadeIn: true }), 1) }

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
    const { fadeIn } = this.state
    const { currentUser, shift } = this.props
    const { isAdmin } = currentUser

    return(
      <fb className={cn({resolveEditBoxMain: 1, arrow_box_pp: 1, fadeIn})}  style={{width: shiftCellWidth - 3}}>
        <fb className='closeButton icon icon-close' onClick={this.close}></fb>
        <fb className='shiftWrapper' key='shiftWrapper'>
          <fb className='headline'>Editiert</fb>
        </fb>
        <ShiftEditBar shift={shift} />
        <fb className='buttonsWrapper' key='btn1'>
          { isAdmin && <fb className='actionButton accept' onClick={this.acceptClicked}>
            {/* <fb className='icon icon-checkmark doneIcon' /> */}
            <fb className='text'>annehmen</fb>
          </fb> }
          <fb className='actionButton reject' key='btn2' onClick={this.rejectClicked}>
            { isAdmin
              ? <fb className='icon icon-do_not_disturb_alt crossIcon' />
              : <fb className='text'>rückgängig</fb>
            }
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

const connector: Connector<OwnProps, Props> = connect(null, actionCreators)
export default connector(ResolveEditBox)
