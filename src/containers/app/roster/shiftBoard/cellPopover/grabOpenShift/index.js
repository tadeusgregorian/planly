//@flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import getFocusedShift from 'selectors/focusedShift'

import { shiftCellWidth, shiftCellHeight } from 'constants/roster'
import { unfocusShiftCell } from 'actions/ui/roster'
import { assignOpenShift } from 'actions/roster'

import './styles.css'

import type { ShiftCell, Shift } from 'types/index'

type Props = {
  cell: ShiftCell,
  shift: Shift,
  userID: string,
  assignOpenShift: (Shift, string)=>void,
  unfocusShiftCell: ()=>void
}

class GrabOpenShift extends PureComponent{
  props: Props

  close = () => this.props.unfocusShiftCell()

  acceptClicked = () => {
    this.props.assignOpenShift(this.props.shift, this.props.userID)
    this.props.unfocusShiftCell()
  }

  render(){
    const { cell } = this.props
    const popPosition = {
      width: shiftCellWidth,
      left: cell.left,
      top: cell.top + shiftCellHeight
    }

    return(
      <fb className='grabOpenShiftPopoverMain arrow_top' style={popPosition}>
        <fb className='closeButton icon icon-close' onClick={this.close}></fb>
        <fb className='headline'>Offene schicht</fb>
        <fb className='buttonsWrapper'>
          <fb className='actionButton' onClick={this.acceptClicked}>schicht übernehmen</fb>
        </fb>
      </fb>
    )
  }
}

const actionsToProps = {
  unfocusShiftCell,
  assignOpenShift
}

const mapStateToProps = (state) => ({
  cell: state.ui.roster.shiftBoard.focusedCell,
  shift: getFocusedShift(state),
  focusedShift: getFocusedShift(state),
  userID: state.auth.currentUserID,
})

export default connect(mapStateToProps, actionsToProps)(GrabOpenShift)
