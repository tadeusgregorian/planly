//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import getCurrentUser from 'selectors/currentUser'
import getFocusedShiftEdit from 'selectors/focusedShiftEdit'

import { getPosition, getDirection, cellChanged } from './localHelpers'
import { unfocusShift } from 'actions/ui/roster'
import { acceptEdit, rejectEdit } from 'actions/roster'

import { shiftToString } from 'helpers/index'
import { shiftCellHeight } from 'constants/roster'

import './styles.css'

import type { ShiftCell, Shift, ShiftEdit, User } from 'types/index'

type Props = {
  cell: ShiftCell,
  shiftEdit: ShiftEdit,
  currentUser: User,
  saveShift: (Shift)=>void,
  unfocusShiftCell: ()=>void
}

class ResolveEdit extends PureComponent{
  props: Props
  ref: HTMLElement
  popoverHeight: number
  openToDirection: shiftToString
  popoverPosition: {}

  updateStyling = (cell: ShiftCell) => {
    this.popoverHeight = this.ref ? this.ref.offsetHeight : 10
    this.openToDirection = getDirection(cell, this.popoverHeight)
    this.popoverPosition = getPosition(cell, this.popoverHeight)
    this.forceUpdate()
  }

  componentDidMount = () => this.updateStyling(this.props.cell)
  componentWillReceiveProps = (nP: Props) => {
    cellChanged(nP.cell, this.props.cell) && this.updateStyling(nP.cell)
  }

  close = () => this.props.unfocusShiftCell()

  acceptClicked = () => {
    acceptEdit(this.props.shiftEdit)
    this.props.unfocusShiftCell()
  }
  rejectClicked = () => {
    rejectEdit(this.props.shiftEdit)
    this.props.unfocusShiftCell()
  }

  render(){
    const { cell, shiftEdit, currentUser } = this.props
    const { isAdmin } = currentUser
    const arrowDirection = getDirection(cell, this.popoverHeight) === 'top' ? 'bottom' : 'top'

    const content = [
      <fb className='shiftWrapper' key='shiftWrapper'>
        <fb className='headline'>editiert:</fb>
        <fb className='editedVersion' style={{height: shiftCellHeight}}>
          <fb className='timeString'>{shiftToString(shiftEdit)}</fb>
          <fb className='cornerBreak'>60</fb>
        </fb>
      </fb>,
      <fb className='buttonsWrapper' key='btn1'>
        { isAdmin && <fb className='actionButton' onClick={this.acceptClicked}>übernehmen</fb> }
        <fb className='actionButton' key='btn2' onClick={this.rejectClicked}>
          { isAdmin ? 'ablehnen' : 'zurücknehmen'}
        </fb>
      </fb>
    ]

    return(
      <fb className={'resolveEditPopoverMain arrow_'+ arrowDirection} style={this.popoverPosition} ref={(ref) => this.ref = ref}>
        <fb className='closeButton icon icon-close' onClick={this.close}></fb>
        { this.openToDirection === 'bottom' ? content : content.reverse()}
      </fb>
    )
  }
}

const actionsToProps = {
  unfocusShift
}

const mapStateToProps = (state) => ({
  cell: state.ui.roster.shiftBoard.focusedCell,
  shiftEdit: getFocusedShiftEdit(state),
  currentUser: getCurrentUser(state)
})

export default connect(mapStateToProps, actionsToProps)(ResolveEdit)
