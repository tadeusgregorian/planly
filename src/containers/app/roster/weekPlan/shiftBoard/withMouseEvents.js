//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openNotesModal } from 'actions/ui/modals'
import { focusShiftCell } from 'actions/ui/roster'
import {
  elementIsShiftCell,
  elementIsNoteIcon,
  targetToShiftCell,
  getParentShiftCell } from './localHelpers'
import { getShiftOfCell } from 'helpers/index'
import getCurrentUser from 'selectors/currentUser'

import PickedUpCell from './pickedUpCell'

import type { User, ShiftCell, Shift, Shifts } from 'types/index'

type MSProps = {
  currentUser: User,
  shifts: Shifts,
}

type MAProps = {
  openNotesModal: (any)=>any,
  focusShiftCell: (ShiftCell)=>any,
}

type OwnProps = {
  saveShift: (Shift)=>void,
  children: any
}

type Props = OwnProps & MSProps & MAProps

type State = {
  pickedUpCell: ?ShiftCell,
  shadowedCell: ?ShiftCell
}

class WithMouseLogic extends PureComponent<void, Props, State> {
  state: State
  props: Props

  isAdmin: boolean
  mouseIsDown: boolean
  isDragging: boolean
  mousePosStart: {x: number, y: number}
  mousePosDelta: {x: number, y: number}
  PickedUpCellRef: ?HTMLElement

  constructor(props: Props){
    super(props)

    this.mouseIsDown = false
    this.isAdmin = !!(this.props.currentUser && this.props.currentUser.isAdmin)
    this.state = {
      pickedUpCell: null,
      shadowedCell: null
    }
  }

  componentDidMount = () => {
    console.log(this.isAdmin);
    document.addEventListener('mouseup',   this.onMouseUp)
    if(this.isAdmin){ // only admin has drag and drop
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseover', this.onMouseOver)
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('mouseup',   this.onMouseUp)
    if(this.isAdmin){ // only admin has drag and drop
      document.removeEventListener('mouseover', this.onMouseOver)
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mousedown', this.onMouseDown)
    }
  }

  onMouseOver = ({target}: any) => {
    if(!this.mouseIsDown) return
    const cellUnderMouse = getParentShiftCell(target)
    //dont allow to shadow Cells that already have a shift.
    const isCellAndEmpty = cellUnderMouse && !cellUnderMouse.hasShift && !cellUnderMouse.hasEdit
    const shadowedCell = isCellAndEmpty ? cellUnderMouse : null

    this.setState({shadowedCell: shadowedCell})
  }

  onMouseDown = (e: any) => {
    const pressedCell = getParentShiftCell(e.target)
    if (!pressedCell) return
    if (!pressedCell.hasShift) return // dont allow draggint empty cells
    if (pressedCell.hasEdit) return   // dont allow dragging cells with shiftEdit

    this.mousePosStart = {x: e.pageX, y: e.pageY}
    this.mouseIsDown = true
    setTimeout(()=> this.pickUpCell(pressedCell), 200)
  }

  onMouseUp = ({target}: any) => {
    if(!this.isDragging){
      const shiftCell = targetToShiftCell(target)
      if(shiftCell.blocked) return
      elementIsNoteIcon(target)  && this.props.openNotesModal({ day: shiftCell.day, user: shiftCell.user , type: 'shiftNote'})
      elementIsShiftCell(target) && this.props.focusShiftCell(shiftCell)
    }

    this.mouseIsDown = false
    this.mousePosStart = {x: 0, y: 0}
    this.state.pickedUpCell && this.dropCell()
  }

  onMouseMove = (e: any) => {
    if (!this.state.pickedUpCell || !this.PickedUpCellRef) return
    this.mousePosDelta = {
      x: e.pageX - this.mousePosStart.x,
      y: e.pageY - this.mousePosStart.y
    }
    this.PickedUpCellRef.style.left = (this.state.pickedUpCell.left + this.mousePosDelta.x) + 'px'
    this.PickedUpCellRef.style.top =  (this.state.pickedUpCell.top + this.mousePosDelta.y) + 'px'
  }

  pickUpCell = (cell: ShiftCell) => {
    if(this.mouseIsDown){
      this.isDragging = true
      this.setState({pickedUpCell: cell})
      const shiftBoard = document.getElementById("shiftBoardMain")
      shiftBoard && shiftBoard.classList.add('cursorMove')
    }
  }

  dropCell = () => {
    const { shadowedCell, pickedUpCell } = this.state
    const { shifts, saveShift } = this.props
    if(pickedUpCell && shadowedCell){
      const pickedUpShift =  getShiftOfCell(shifts, pickedUpCell)
      if(shadowedCell && pickedUpShift){
        const { s, e, b } = pickedUpShift
        const newShift = { s, e, b, day: shadowedCell.day, user: shadowedCell.user }
        saveShift(newShift)
      }
    }

    this.isDragging = false
    this.setState({pickedUpCell: null, shadowedCell: null})
    const shiftBoard = document.getElementById("shiftBoardMain")
    shiftBoard && shiftBoard.classList.remove('cursorMove')
  }

  render = () => {
    const { pickedUpCell, shadowedCell } = this.state
    const { shifts } = this.props


    return (
      <fb style={{position: 'relative'}}>
        {React.cloneElement(this.props.children, {...this.props, shadowedCell })}
        { pickedUpCell &&
          <PickedUpCell
            getRef={(el) => {this.PickedUpCellRef = el}}
            shift={getShiftOfCell(shifts, pickedUpCell)}
            cell={pickedUpCell} />
        }
      </fb>
    )
  }
}

const actionsToProps: MAProps = {
  openNotesModal,
  focusShiftCell
}

const mapStateToProps = (state: any, ow: OwnProps): MSProps => ({
  currentUser: getCurrentUser(state),
  shifts: state.roster.shiftWeek
})

export default connect(mapStateToProps, actionsToProps)(WithMouseLogic)
