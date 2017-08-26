//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import UserShifts from './userShifts'
import OpenShifts from './openShifts'
import CellPopover from './cellPopover'
import ShiftBoardHead from './shiftBoardHead'
import './styles.css'

import type { Shift, ShiftCell } from 'types/index'

export type Props = {
  focusedCell: ?ShiftCell,
  shadowedCell: ?ShiftCell, // comes from HOC
  saveShift: (Shift)=> void,
}

class ShiftBoard extends PureComponent{
  props: Props

  render(){
    const { focusedCell, shadowedCell, saveShift } = this.props

    return(
      <fb id="shiftBoardMain">
          <ShiftBoardHead />
          <OpenShifts />
          <UserShifts shadowedCell={shadowedCell} />
          { focusedCell && <CellPopover saveShift={saveShift} focusedCell={focusedCell}/> }
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  focusedCell: state.ui.roster.weekPlan.focusedCell,
})

export default connect(mapStateToProps)(ShiftBoard)
