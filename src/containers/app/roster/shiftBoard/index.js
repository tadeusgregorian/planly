//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import type { Connector } from 'react-redux'
import type { Store } from 'types/index'

import UserShifts from './userShifts'
import OpenShifts from './openShifts'
import CellPopover from './cellPopover'
import ShiftBoardHead from './shiftBoardHead'
import './styles.css'

import type { ShiftCell, Shifts } from 'types/index'

type OwnProps = {
  shifts: Shifts,
  shadowedCell?: ?ShiftCell, // comes from HOC // there is a ? before the colon -> because flow thows error cause of injection of props
}

type ConProps = {
  focusedCell: ?ShiftCell,
}

type Props = ConProps & OwnProps

class ShiftBoard extends PureComponent{
  props: Props

  render(){
    const { focusedCell, shadowedCell, shifts } = this.props

    return(
      <fb id="shiftBoardMain">
          <ShiftBoardHead />
          <OpenShifts shifts={shifts} />
          <UserShifts shifts={shifts} shadowedCell={shadowedCell}/>
          { focusedCell && <CellPopover focusedCell={focusedCell}/> }
      </fb>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  focusedCell: state.ui.roster.shiftBoard.focusedCell,
})


const connector: Connector<OwnProps, Props> = connect(mapStateToProps)
export default connector(ShiftBoard)
