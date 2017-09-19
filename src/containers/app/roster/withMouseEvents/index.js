//@flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { openNotesModal } from 'actions/ui/modals'
import { focusShift, createShift } from 'actions/ui/roster'
import { saveShiftToDB } from 'actions/roster'
import {
  getParentShift,
  getParentCell } from './localHelpers'
import { getShiftOfCell, generateGuid } from 'helpers/index'
import getCurrentUser from 'selectors/currentUser'

import PickedUpShift from './pickedUpShift'

import type { User, ShiftCell, ShiftRef, Shift, Shifts, Store } from 'types/index'

type MSProps = {
  currentUser: User,
  shifts: Shifts,
}

type MAProps = {
  openNotesModal: (any)=>any,
  focusShift: (ShiftRef)=>any,
  saveShiftToDB: (Shift)=>any
}

type OwnProps = {
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
    document.addEventListener('click',   this.onClick)
    if(this.isAdmin){ // only admin has drag and drop
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseover', this.onMouseOver)
      document.addEventListener('mousedown', this.onMouseDown)
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('click',   this.onClick)
    if(this.isAdmin){ // only admin has drag and drop
      document.removeEventListener('mouseover', this.onMouseOver)
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mousedown', this.onMouseDown)
    }
  }

  onMouseOver = ({target}: any) => {
    if(!this.mouseIsDown) return
    const cellUnderMouse = getParentCell(target)
    //dont allow to shadow Cells that already have a shift.
    const isCellAndEmpty = cellUnderMouse && !cellUnderMouse.hasShift
    const shadowedCell = isCellAndEmpty ? cellUnderMouse : null

    this.setState({shadowedCell: shadowedCell})
  }

  onMouseDown = (e: any) => {
    const pressedCell = getParentCell(e.target)
    if (!pressedCell) return
    if (!pressedCell.hasShift) return // dont allow draggint empty cells
    if (pressedCell.hasEdit) return   // dont allow dragging cells with shiftEdit

    this.mousePosStart = {x: e.pageX, y: e.pageY}
    this.mouseIsDown = true
    setTimeout(()=> this.pickUpCell(pressedCell), 200)
  }

  onClick = ({target}: any) => {
    if(!this.isDragging){

      const targetShift = getParentShift(target)
      const targetCell = getParentCell(target)

      if(targetShift) return this.props.focusShift(targetShift)
      if(targetCell)  return this.props.createShift(targetCell)

      // elementIsShiftCell(target) && this.props.focusShiftCell(shiftCell)
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
    const { shifts } = this.props
    if(pickedUpCell && shadowedCell){
      const pickedUpShift =  getShiftOfCell(shifts, pickedUpCell)
      if(shadowedCell && pickedUpShift){
        const { s, e, b } = pickedUpShift
        const id = generateGuid()
        const newShift = { id, s, e, b, day: shadowedCell.day, user: shadowedCell.user }
        this.props.saveShiftToDB(newShift)
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
        {React.cloneElement(this.props.children, { shadowedCell })}
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
  focusShift,
  createShift,
  saveShiftToDB
}

const mapStateToProps = (state: Store, ow: OwnProps): MSProps => ({
  currentUser: getCurrentUser(state),
  shifts: state.roster.shiftWeek
})

export default connect(mapStateToProps, actionsToProps)(WithMouseLogic)
