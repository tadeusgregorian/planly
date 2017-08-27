//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import UserShifts from './userShifts'
import OpenShifts from './openShifts'
import CellPopover from './cellPopover'
import ShiftBoardHead from './shiftBoardHead'
import './styles.css'

import type { ShiftCell } from 'types/index'

export type Props = {
  focusedCell: ?ShiftCell,
  shadowedCell: ?ShiftCell, // comes from HOC
}

class ShiftBoard extends PureComponent{
  props: Props

  render(){
    const { focusedCell, shadowedCell } = this.props

    return(
      <fb id="shiftBoardMain">
          <ShiftBoardHead />
          <OpenShifts />
          <UserShifts shadowedCell={shadowedCell} />
          { focusedCell && <CellPopover focusedCell={focusedCell}/> }
      </fb>
    )
  }
}

const mapStateToProps = (state) => ({
  focusedCell: state.ui.roster.weekPlan.focusedCell,
})

export default connect(mapStateToProps)(ShiftBoard)
