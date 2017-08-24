//@flow

import React, { PureComponent } from 'react'
import type { ShiftCell } from 'types/index'
import {
  elementIsShiftCell,
  elementIsNoteIcon,
  targetToShiftCell,
  getParentShiftCell,
  getShiftOfCell } from './localHelpers'
import type { Props } from './index'

type State = { pickedUpCell: ?ShiftCell, shadowedCell: ?ShiftCell }

type Enhancer = (component: Class<React$Component<void, Props, void>>) =>
  Class<React$Component<void, Props, State>>


const enhancer:Enhancer = (Component) => {
  return class WithMouseLogic extends PureComponent {

    cellUnderMouse: ?ShiftCell
    isAdmin: boolean
    mouseIsDown: boolean
    isDragging: boolean
    mousePosStart: {x: number, y: number}
    mousePosDelta: {x: number, y: number}
    PickedUpCellRef: ?HTMLElement

    state: State

    constructor(props: any){
      super(props)

      this.mouseIsDown = false
      // props.currentUser comes from connect from the ShiftBoard Class
      this.isAdmin = !!(this.props.currentUser && this.props.currentUser.isAdmin)
      this.state = { pickedUpCell: null, shadowedCell: null }
    }

    componentDidMount = () => {
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
      this.cellUnderMouse = getParentShiftCell(target)
      //dont allow to shadow Cells that already have a shift.
      if(this.cellUnderMouse && getShiftOfCell(this.props.shifts, this.cellUnderMouse)){
        this.cellUnderMouse = null
      }
      this.setState({shadowedCell: this.cellUnderMouse})
    }

    onMouseDown = (e: any) => {
      const pressedCell = getParentShiftCell(e.target)
      if (!pressedCell) return
      // dont allow picking cells Up that dont have shifts
      if (!getShiftOfCell(this.props.shifts, pressedCell)) return
      this.mousePosStart = {x: e.pageX, y: e.pageY}
      this.mouseIsDown = true
      setTimeout(()=> this.pickUpCell(pressedCell), 200)
    }

    onMouseUp = ({target}: any) => {
      if(!this.isDragging){
        const shiftCell = targetToShiftCell(target)
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
          const newShift = { ...pickedUpShift, day: shadowedCell.day, user: shadowedCell.user }
          saveShift(newShift)
        }
      }

      this.isDragging = false
      this.setState({pickedUpCell: null, shadowedCell: null})
      const shiftBoard = document.getElementById("shiftBoardMain")
      shiftBoard && shiftBoard.classList.remove('cursorMove')
    }

    render = () => {
      return (
        <Component  { ...this.props }
          pickedUpCell={this.state.pickedUpCell}
          shadowedCell={this.state.shadowedCell}
          getPickedUpCellRef={(el) => {this.PickedUpCellRef = el}}
        />
    )}
  }
}

export default enhancer
