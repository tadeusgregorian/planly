//@flow

import React, { PureComponent } from 'react'

import { getPosition, getDirection } from './localHelpers'
import { shiftToString } from 'helpers/index'
import { shiftCellHeight } from 'constants/roster'

import './styles.css'

import type { ShiftCell, Shift, ShiftEdit, User, Note } from 'types/index'

type Props = {
  cell: ShiftCell,
  shift: ?Shift,
  shiftEdit: ?ShiftEdit,
  currentUser: User,
  note: ?Note,
  openNotesModal: ()=>void,
  saveShift: ()=>void,
}

export default class ResolveEdit extends PureComponent{
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

  cellChanged = (cell1: ShiftCell, cell2: ShiftCell) => cell1.user !== cell2.user || cell1.day !== cell2.day

  componentDidMount = () => this.updateStyling(this.props.cell)
  componentWillReceiveProps = (nP: Props) => {
    this.cellChanged(nP.cell, this.props.cell) && this.updateStyling(nP.cell)
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
      <fb className='wrapper' key='btn1'>{ isAdmin && <fb className='actionButton'>übernehmen</fb> }</fb>,
      <fb className='actionButton' key='btn2'>{ isAdmin ? 'ablehnen' : 'zurücknehmen'}</fb>
    ]

    return(
      <fb className={'resolveEditPopoverMain arrow_'+ arrowDirection} style={this.popoverPosition} ref={(ref) => this.ref = ref}>
        { this.openToDirection === 'bottom' ? content : content.reverse()}
      </fb>
    )
  }
}
